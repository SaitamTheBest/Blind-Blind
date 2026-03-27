using Blind_Blind_Backend.Services.DataGames;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blind_Blind_Backend.Controllers.DataGames
{
    [Authorize]
    [ApiController]
    [Route("api/music-data")]
    public class MusicDataController : ControllerBase
    {
        private readonly IMusicDataService _service;
        public MusicDataController(IMusicDataService service)
        {
            _service = service;
        }


    }
}
