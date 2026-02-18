using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace gpass_app_wpf.DAL
{
    public class ApiService
    {
        private readonly HttpClient _client;

        public string Token { get; set; }

        public ApiService()
        {
            _client = new HttpClient();
            _client.BaseAddress = new Uri("http://localhost:4000/");
        }

        public async Task<T> PostAsync<T>(string url, object data)
        {
            var json = JsonSerializer.Serialize(data);

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _client.PostAsync(url, content);

            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Status: {response.StatusCode}\n{responseContent}");

            return JsonSerializer.Deserialize<T>(responseContent);
        }

    }
}
