using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace gpass_app_wpf.DAL
{
    public class ApiService
    {
        private readonly HttpClient _client;

        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public ApiService()
        {
            _client = new HttpClient();
            _client.BaseAddress = new Uri("http://localhost:4000/api/");
        }

        private void AttachCookie(HttpRequestMessage request)
        {
            if (!string.IsNullOrEmpty(SessionService.Token))
                request.Headers.Add("Cookie", $"user_token={SessionService.Token}");
        }

        private static async Task EnsureSuccess(HttpResponseMessage response)
        {
            if (response.IsSuccessStatusCode) return;

            var body = await response.Content.ReadAsStringAsync();
            string message = null;
            try
            {
                var doc = JsonSerializer.Deserialize<JsonElement>(body);
                if (doc.TryGetProperty("details", out var details) && details.ValueKind == JsonValueKind.String)
                    message = details.GetString();
                if (string.IsNullOrEmpty(message) && doc.TryGetProperty("message", out var msg))
                    message = msg.GetString();
            }
            catch { }
            throw new Exception(message ?? $"{(int)response.StatusCode} {response.ReasonPhrase}");
        }

        private async Task<string> SendAndRead(HttpMethod method, string endpoint, object data = null)
        {
            var request = new HttpRequestMessage(method, endpoint);
            AttachCookie(request);
            if (data != null)
                request.Content = new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json");
            var response = await _client.SendAsync(request);
            await EnsureSuccess(response);
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<T> GetAsync<T>(string endpoint)
            => JsonSerializer.Deserialize<T>(await SendAndRead(HttpMethod.Get, endpoint), _jsonOptions);

        // Raw JSON lekérés — ha a scope hibás és null mezőket küld
        public async Task<string> GetRawAsync(string endpoint)
            => await SendAndRead(HttpMethod.Get, endpoint);

        public async Task<T> PostAsync<T>(string endpoint, object data)
            => JsonSerializer.Deserialize<T>(await SendAndRead(HttpMethod.Post, endpoint, data), _jsonOptions);

        public async Task<T> PutAsync<T>(string endpoint, object data)
            => JsonSerializer.Deserialize<T>(await SendAndRead(HttpMethod.Put, endpoint, data), _jsonOptions);

        public async Task DeleteAsync(string endpoint)
            => await SendAndRead(HttpMethod.Delete, endpoint);
    }
}
