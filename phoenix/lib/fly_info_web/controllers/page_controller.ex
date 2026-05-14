defmodule FlyInfoWeb.PageController do
  use FlyInfoWeb, :controller

  def home(conn, _params) do
    machine_id = System.get_env("FLY_MACHINE_ID", "unknown")
    app_name = System.get_env("FLY_APP_NAME", "unknown")
    api_token = System.get_env("FLY_API_TOKEN", "")

    metadata =
      if machine_id != "unknown" and api_token != "" do
        fetch_machine_metadata(app_name, machine_id, api_token)
      else
        %{}
      end

    assigns = %{
      machine_id: machine_id,
      machine_name: :inet.gethostname() |> elem(1) |> List.to_string(),
      image: get_in(metadata, ["config", "image"]) || System.get_env("FLY_IMAGE_REF", "unknown"),
      created_at: Map.get(metadata, "created_at", "unknown"),
      region: System.get_env("FLY_REGION", "unknown"),
      private_ip: get_private_ip(),
      state: Map.get(metadata, "state", "unknown")
    }

    render(conn, :home, assigns)
  end

  defp fetch_machine_metadata(app_name, machine_id, token) do
    :inets.start()
    :ssl.start()

    path = "/v1/apps/#{app_name}/machines/#{machine_id}"
    request = "GET #{path} HTTP/1.0\r\nHost: _api.internal\r\nAuthorization: Bearer #{token}\r\n\r\n"

    ip =
      case :inet_res.lookup('_api.internal', :in, :aaaa) do
        [ip | _] -> ip
        [] -> {64938, 0, 0, 0, 0, 0, 0, 3}
      end

    case :gen_tcp.connect(ip, 4280, [:binary, :inet6, active: false], 5000) do
      {:ok, sock} ->
        :gen_tcp.send(sock, request)
        case recv_all(sock, "") do
          {:ok, response} ->
            :gen_tcp.close(sock)
            case String.split(response, "\r\n\r\n", parts: 2) do
              [_headers, body] -> Jason.decode!(body)
              _ -> %{}
            end
          _ ->
            :gen_tcp.close(sock)
            %{}
        end
      _ ->
        %{}
    end
  rescue
    _ -> %{}
  end

  defp recv_all(sock, acc) do
    case :gen_tcp.recv(sock, 0, 5000) do
      {:ok, data} -> recv_all(sock, acc <> data)
      {:error, :closed} -> {:ok, acc}
      {:error, _} -> {:ok, acc}
    end
  end

  defp get_private_ip do
    case :inet.getifaddrs() do
      {:ok, ifaddrs} ->
        ifaddrs
        |> Enum.flat_map(fn {_name, opts} -> Keyword.get_values(opts, :addr) end)
        |> Enum.find_value("unknown", fn
          {a, b, c, d} when {a, b, c, d} != {127, 0, 0, 1} ->
            "#{a}.#{b}.#{c}.#{d}"
          _ -> nil
        end)
      _ ->
        System.get_env("FLY_PRIVATE_IP", "unknown")
    end
  end
end