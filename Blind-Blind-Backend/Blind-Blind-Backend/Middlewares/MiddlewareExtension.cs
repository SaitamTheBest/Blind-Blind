using Blind_Blind_Backend.Middlewares.Services;

namespace Blind_Blind_Backend.Middlewares
{
    public static class MiddlewareExtension
    {
        public static IApplicationBuilder UseHttpLoggingMiddleware(this IApplicationBuilder app)
        {
            return app.UseMiddleware<HttpLoggingMiddleware>();
        }
    }
}
