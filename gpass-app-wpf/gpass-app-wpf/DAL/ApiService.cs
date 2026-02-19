using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace gpass_app_wpf.DAL
{
    public class ApiService
    {
        private readonly HttpClient _client;

        // Case-insensitive, hogy a backend snake_case / camelCase mezők mind működjenek
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

        public async Task<T> PostAsync<T>(string endpoint, object data)
        {
            var json = JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.Post, endpoint) { Content = content };
            AttachCookie(request);
            var response = await _client.SendAsync(request);
            await EnsureSuccess(response);
            return JsonSerializer.Deserialize<T>(await response.Content.ReadAsStringAsync(), _jsonOptions);
        }

        public async Task<T> GetAsync<T>(string endpoint)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, endpoint);
            AttachCookie(request);
            var response = await _client.SendAsync(request);
            await EnsureSuccess(response);
            return JsonSerializer.Deserialize<T>(await response.Content.ReadAsStringAsync(), _jsonOptions);
        }

        public async Task<T> PutAsync<T>(string endpoint, object data)
        {
            var json = JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.Put, endpoint) { Content = content };
            AttachCookie(request);
            var response = await _client.SendAsync(request);
            await EnsureSuccess(response);
            return JsonSerializer.Deserialize<T>(await response.Content.ReadAsStringAsync(), _jsonOptions);
        }

        public async Task DeleteAsync(string endpoint)
        {
            var request = new HttpRequestMessage(HttpMethod.Delete, endpoint);
            AttachCookie(request);
            var response = await _client.SendAsync(request);
            await EnsureSuccess(response);
        }
    }
}
