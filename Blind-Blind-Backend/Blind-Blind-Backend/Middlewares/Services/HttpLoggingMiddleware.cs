using Blind_Blind_Backend.Domain;
using Blind_Blind_Backend.Entities.Logs;
using System.Diagnostics;

namespace Blind_Blind_Backend.Middlewares.Services
{
    public class HttpLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public HttpLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, BlindBlindContext dbContext)
        {
            var stopwatch = Stopwatch.StartNew();

            await _next(context);

            stopwatch.Stop();

            var log = new HttpLog
            {
                Method = context.Request.Method,
                Endpoint = context.Request.Path,
                IpAddress = context.Connection.RemoteIpAddress?.ToString(),
                StatusCode = context.Response.StatusCode,
                DurationMs = (int)stopwatch.ElapsedMilliseconds,
                CreatedAt = DateTime.UtcNow
            };

            dbContext.HttpLog.Add(log);
            await dbContext.SaveChangesAsync();
        }
    }
}
