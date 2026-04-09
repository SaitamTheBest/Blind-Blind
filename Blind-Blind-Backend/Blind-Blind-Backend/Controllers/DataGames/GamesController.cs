using Blind_Blind_Backend.DTOs.DataGames;
using Blind_Blind_Backend.Services.DataGames;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Blind_Blind_Backend.Controllers.DataGames
{
    [ApiController]
    [Route("api/games")]
    public class GamesController : ControllerBase
    {
        private readonly IGamesService _service;
        public GamesController(IGamesService service)
        {
            _service = service;
        }
    }
}
