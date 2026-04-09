using Blind_Blind_Backend.DTOs.DataGames;
using Blind_Blind_Backend.Services.DataGames;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blind_Blind_Backend.Controllers.DataGames
{
    //[Authorize(Policy = "AdminOnly")] // or [Authorize]
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

        #region ALBUMS
        /// <summary>
        /// Retrieves all albums available in the system.
        /// </summary>
        /// <remarks>This method performs an asynchronous operation to fetch all albums from the underlying
        /// service. The response will always be an HTTP 200 with the list of albums, which may be empty if no albums
        /// are available.</remarks>
        /// <returns>An <see cref="IActionResult"/> containing a list of <see cref="AlbumDTO"/> objects representing the
        /// available albums. Returns an HTTP 200 response with the list.</returns>
        [Tags("Albums")]
        [HttpGet("albums")]
        [ProducesResponseType(typeof(List<AlbumDTO>), 200)]
        public async Task<IActionResult> GetAllAlbums()
        {
            var albums = await _service.GetAllAlbums();
            return Ok(albums);
        }

        /// <summary>
        /// Retrieves the album that matches the specified unique identifier.
        /// </summary>
        /// <remarks>If the album does not exist, the response includes a message indicating that the
        /// album was not found.</remarks>
        /// <param name="id">The unique identifier of the album to retrieve. This value must not be null or empty.</param>
        /// <returns>An IActionResult containing the album details if the album is found; otherwise, a 404 Not Found response.</returns>
        [Tags("Albums")]
        [HttpGet("album/{id}")]
        [ProducesResponseType(typeof(AlbumDTO), 200)]
        [ProducesResponseType(404)]
        public IActionResult GetAlbumById(string id)
        {
            var album = _service.GetAlbumById(id);
            if (album == null)
                return NotFound(new { message = "Album non trouvé." });
            return Ok(album);
        }

        /// <summary>
        /// Creates a new album using the specified album details.
        /// </summary>
        /// <remarks>This method requires the caller to have admin privileges.</remarks>
        /// <param name="albumCrudDTO">An object containing the details of the album to create. This parameter must not be null.</param>
        /// <returns>An IActionResult that indicates the result of the operation. Returns a 200 status code with a success
        /// message if the album is created successfully; otherwise, returns a 400 status code if the input is invalid.</returns>
        [Tags("Albums")]
        [HttpPost("album")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateAlbum([FromBody] AlbumCrudDTO albumCrudDTO)
        {
            await _service.CreateAlbum(albumCrudDTO);
            return Ok(new { message = "Album créé avec succès." });
        }

        /// <summary>
        /// Updates an existing album with the specified details.
        /// </summary>
        /// <remarks>This method requires the caller to have admin privileges. It handles HTTP PUT
        /// requests to update album information and is accessible only to authorized users with the 'AdminOnly'
        /// policy.</remarks>
        /// <param name="albumCrudDTO">An object containing the updated album information, including properties such as title, artist, and release
        /// date. This parameter must not be null.</param>
        /// <returns>An IActionResult that indicates the result of the update operation. Returns a 200 OK response with a success
        /// message if the update is successful; otherwise, returns a 400 Bad Request response with an error message.</returns>
        [Tags("Albums")]
        [HttpPut("album")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateAlbum([FromBody] AlbumCrudDTO albumCrudDTO)
        {
            try
            {
                await _service.UpdateAlbum(albumCrudDTO);
                return Ok(new { message = "Album mis à jour avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Deletes the album with the specified identifier.
        /// </summary>
        /// <remarks>This method requires authorization with the 'AdminOnly' policy. Throws an
        /// ArgumentException if the provided id is invalid.</remarks>
        /// <param name="id">The unique identifier of the album to delete. This parameter cannot be null or empty.</param>
        /// <returns>An IActionResult that indicates the result of the delete operation. Returns a success message if the album
        /// is deleted; otherwise, returns a BadRequest with an error message.</returns>
        [Tags("Albums")]
        [HttpDelete("album/{id}")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> DeleteAlbum(string id)
        {
            try
            {
                await _service.DeleteAlbum(id);
                return Ok(new { message = "Album supprimé avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region ARTISTS
        /// <summary>
        /// Retrieves all artists available in the system.
        /// </summary>
        /// <remarks>This method performs an asynchronous operation to fetch all artists from the underlying
        /// service. The response will always be an HTTP 200 with the list of artists, which may be empty if no artists
        /// are available.</remarks>
        /// <returns>An <see cref="IActionResult"/> containing a list of <see cref="ArtistDTO"/> objects representing the
        /// available artists. Returns an HTTP 200 response with the list.</returns>
        [Tags("Artists")]
        [HttpGet("artists")]
        [ProducesResponseType(typeof(List<ArtistDTO>), 200)]
        public async Task<IActionResult> GetAllArtists()
        {
            var artists = await _service.GetAllArtists();
            return Ok(artists);
        }

        /// <summary>
        /// Retrieves the artist information associated with the specified artist identifier.
        /// </summary>
        /// <remarks>If the artist with the specified identifier does not exist, a NotFound response is
        /// returned with a message indicating that the artist was not found.</remarks>
        /// <param name="id">The unique identifier of the artist to retrieve. This value cannot be null or empty.</param>
        /// <returns>An IActionResult containing the artist information if found; otherwise, a 404 Not Found response.</returns>
        [Tags("Artists")]
        [HttpGet("artist/{id}")]
        [ProducesResponseType(typeof(ArtistDTO), 200)]
        [ProducesResponseType(404)]
        public IActionResult GetArtistById(string id)
        {
            var artist = _service.GetArtistById(id);
            if (artist == null)
                return NotFound(new { message = "Artiste non trouvé." });
            return Ok(artist);
        }

        /// <summary>
        /// Creates a new artist using the specified artist data.
        /// </summary>
        /// <remarks>This method requires the caller to have admin privileges. Only users authorized with
        /// the 'AdminOnly' policy can access this endpoint.</remarks>
        /// <param name="artistCrudDTO">An object containing the details of the artist to create. This parameter must not be null and should include
        /// all required artist information.</param>
        /// <returns>An IActionResult that indicates the result of the operation. Returns a 200 status code with a success
        /// message if the artist is created successfully; otherwise, returns a 400 status code if the input data is
        /// invalid.</returns>
        [Tags("Artists")]
        [HttpPost("artist")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateArtist([FromBody] ArtistCrudDTO artistCrudDTO)
        {
            await _service.CreateArtist(artistCrudDTO);
            return Ok(new { message = "Artiste créé avec succès." });
        }

        /// <summary>
        /// Updates the details of an existing artist using the provided data transfer object.
        /// </summary>
        /// <remarks>This method requires the caller to be authorized with the 'AdminOnly' policy. It
        /// returns appropriate HTTP status codes based on the outcome of the update operation.</remarks>
        /// <param name="artistCrudDTO">An object containing the updated information for the artist. This parameter must include all required fields
        /// for the update operation and cannot be null.</param>
        /// <returns>An IActionResult that indicates the result of the update operation. Returns a 200 OK response with a success
        /// message if the update is successful; otherwise, returns a 400 Bad Request with an error message.</returns>
        [Tags("Artists")]
        [HttpPut("artist")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateArtist([FromBody] ArtistCrudDTO artistCrudDTO)
        {
            try
            {
                await _service.UpdateArtist(artistCrudDTO);
                return Ok(new { message = "Artiste mis à jour avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Deletes the artist with the specified identifier.
        /// </summary>
        /// <remarks>This method requires authorization with the 'AdminOnly' policy. An ArgumentException
        /// is returned as a bad request if the provided identifier is invalid.</remarks>
        /// <param name="id">The unique identifier of the artist to delete. This value cannot be null or empty.</param>
        /// <returns>An IActionResult that indicates the result of the delete operation. Returns a success message if the artist
        /// is deleted successfully; otherwise, returns a bad request message with error details.</returns>
        [Tags("Artists")]
        [HttpDelete("artist/{id}")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> DeleteArtist(string id)
        {
            try
            {
                await _service.DeleteArtist(id);
                return Ok(new { message = "Artiste supprimé avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region TRACKS
        /// <summary>
        /// Retrieves all tracks available in the system.
        /// </summary>
        /// <remarks>This method performs an asynchronous operation to fetch all tracks from the underlying
        /// service. The response will always be an HTTP 200 with the list of tracks, which may be empty if no tracks
        /// are available.</remarks>
        /// <returns>An <see cref="IActionResult"/> containing a list of <see cref="TrackDTO"/> objects representing the
        /// available tracks. Returns an HTTP 200 response with the list.</returns>
        [Tags("Tracks")]
        [HttpGet("tracks")]
        [ProducesResponseType(typeof(List<TrackDTO>), 200)]
        public async Task<IActionResult> GetAllTracks()
        {
            var tracks = await _service.GetAllTracks();
            return Ok(tracks);
        }

        /// <summary>
        /// Retrieves the details of a track specified by its unique identifier.
        /// </summary>
        /// <remarks>If the track with the specified identifier does not exist, the response is a 404 Not
        /// Found with a message indicating that the track was not found.</remarks>
        /// <param name="id">The unique identifier of the track to retrieve. This value cannot be null or empty.</param>
        /// <returns>An IActionResult containing the track details if found; otherwise, a 404 Not Found response.</returns>
        [Tags("Tracks")]
        [HttpGet("track/{id}")]
        [ProducesResponseType(typeof(TrackDTO), 200)]
        [ProducesResponseType(404)]
        public IActionResult GetTrackById(string id)
        {
            var track = _service.GetTrackById(id);
            if (track == null)
                return NotFound(new { message = "Track non trouvé." });
            return Ok(track);
        }

        /// <summary>
        /// Creates a new track using the specified track data.
        /// </summary>
        /// <remarks>This action requires authorization with the 'AdminOnly' policy. Only users with the
        /// appropriate permissions can access this endpoint.</remarks>
        /// <param name="trackCrudDTO">The data transfer object containing the details of the track to create. This parameter must not be null and
        /// should include all required track information.</param>
        /// <returns>An IActionResult that indicates the result of the operation. Returns a 200 status code with a success
        /// message if the track is created successfully, or a 400 status code if the input data is invalid.</returns>
        [Tags("Tracks")]
        [HttpPost("track")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateTrack([FromBody] TrackCrudDTO trackCrudDTO)
        {
            await _service.CreateTrack(trackCrudDTO);
            return Ok(new { message = "Track créée avec succès." });
        }

        /// <summary>
        /// Updates the details of an existing track using the provided data transfer object.
        /// </summary>
        /// <remarks>This action requires the caller to be authorized with the 'AdminOnly' policy. If the
        /// input data is invalid, an ArgumentException may be thrown and a corresponding error message will be
        /// returned.</remarks>
        /// <param name="trackCrudDTO">An object containing the updated track information. This parameter must not be null and should include all
        /// required fields for the track.</param>
        /// <returns>An IActionResult that indicates the outcome of the update operation. Returns a 200 OK response with a
        /// success message if the update is successful; otherwise, returns a 400 Bad Request response with an error
        /// message.</returns>
        [Tags("Tracks")]
        [HttpPut("track")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateTrack([FromBody] TrackCrudDTO trackCrudDTO)
        {
            try
            {
                await _service.UpdateTrack(trackCrudDTO);
                return Ok(new { message = "Track mise à jour avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Deletes the track identified by the specified unique identifier.
        /// </summary>
        /// <remarks>This method requires the caller to be authorized with the 'AdminOnly' policy. An
        /// ArgumentException is returned as a BadRequest if the provided identifier is invalid.</remarks>
        /// <param name="id">The unique identifier of the track to delete. Cannot be null or empty.</param>
        /// <returns>An IActionResult that indicates the result of the deletion operation. Returns a success message if the track
        /// is deleted; otherwise, returns a BadRequest with an error message.</returns>
        [Tags("Tracks")]
        [HttpDelete("track/{id}")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> DeleteTrack(string id)
        {
            try
            {
                await _service.DeleteTrack(id);
                return Ok(new { message = "Track supprimée avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Adds a collection of artist identifiers as featurings to the specified track.
        /// </summary>
        /// <remarks>This method requires the caller to have admin privileges and is accessible via an
        /// HTTP POST request to the route 'track/{trackId}/featurings'.</remarks>
        /// <param name="trackId">The unique identifier of the track to which the featurings will be added. This parameter cannot be null or
        /// empty.</param>
        /// <param name="artistIds">A list of unique identifiers for the artists to be added as featurings. This list must not be null.</param>
        /// <returns>An IActionResult that indicates the result of the operation. Returns a success message if the featurings are
        /// added successfully; otherwise, returns a bad request with an error message.</returns>
        [Tags("Tracks")]
        [HttpPost("track/{trackId}/featurings")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> AddFeaturingsToTrack(string trackId, [FromBody] List<string> artistIds)
        {
            try
            {
                await _service.AddFeaturingsToTrack(trackId, artistIds);
                return Ok(new { message = "Featurings ajoutés avec succès." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Updates the list of featured artists for the specified track.
        /// </summary>
        /// <remarks>This operation requires administrative privileges and is accessible only to users
        /// authorized with the 'AdminOnly' policy. The method is intended to be called via an HTTP PUT
        /// request.</remarks>
        /// <param name="trackId">The unique identifier of the track whose featured artists are to be updated. Cannot be null or empty.</param>
        /// <param name="artistIds">A list of artist identifiers to set as featured artists for the track. This list must not be null or empty.</param>
        /// <returns>An IActionResult that indicates the result of the update operation. Returns a 200 OK response with a success
        /// message if the update is successful; otherwise, returns a 400 Bad Request with an error message.</returns>
        [Tags("Tracks")]
        [HttpPut("track/{trackId}/featurings")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateFeaturingsForTrack(string trackId, [FromBody] List<string> artistIds)
        {
            try
            {
                await _service.UpdateFeaturingsForTrack(trackId, artistIds);
                return Ok(new { message = "Featurings mis à jour avec succès." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region GENRES
        /// <summary>
        /// Retrieves a collection of all available music genres.
        /// </summary>
        /// <remarks>This method performs an asynchronous operation to fetch genres from the underlying
        /// service. The response will always be an HTTP 200 with the list of genres, which may be empty if no genres
        /// are available.</remarks>
        /// <returns>An <see cref="IActionResult"/> containing a list of <see cref="GenreDTO"/> objects representing the
        /// available genres. Returns an HTTP 200 response with the list.</returns>
        [Tags("Genres")]
        [HttpGet("genres")]
        [ProducesResponseType(typeof(List<GenreDTO>), 200)]
        public async Task<IActionResult> GetAllGenres()
        {
            var genres = await _service.GetAllGenres();
            return Ok(genres);
        }

        /// <summary>
        /// Retrieves the genre that corresponds to the specified identifier.
        /// </summary>
        /// <remarks>If no genre exists with the specified identifier, the response will be 404 Not Found
        /// with a message indicating that the genre was not found.</remarks>
        /// <param name="id">The unique identifier of the genre to retrieve. Must be a positive integer.</param>
        /// <returns>An IActionResult containing the genre data as a GenreDTO if found; otherwise, a 404 Not Found response.</returns>
        [Tags("Genres")]
        [HttpGet("genre/{id}")]
        [ProducesResponseType(typeof(GenreDTO), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetGenreById(int id)
        {
            var genre = await _service.GetGenreById(id);
            if (genre == null)
                return NotFound(new { message = "Genre non trouvé." });
            return Ok(genre);
        }

        /// <summary>
        /// Creates a new genre using the specified genre data.
        /// </summary>
        /// <remarks>This action requires the caller to have admin privileges. The request body must
        /// contain valid genre data; otherwise, a 400 Bad Request response is returned.</remarks>
        /// <param name="genreCrudDTO">An object containing the details of the genre to create. This parameter must not be null.</param>
        /// <returns>An IActionResult that indicates the result of the operation. Returns a 200 OK response with a success
        /// message if the genre is created successfully, or a 400 Bad Request response if the input data is invalid.</returns>
        [Tags("Genres")]
        [HttpPost("genre")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateGenre([FromBody] GenreCrudDTO genreCrudDTO)
        {
            await _service.CreateGenre(genreCrudDTO);
            return Ok(new { message = "Genre créé avec succès." });
        }

        /// <summary>
        /// Updates the details of an existing genre using the provided data transfer object.
        /// </summary>
        /// <remarks>This method requires the caller to be authorized with the 'AdminOnly' policy. It
        /// returns appropriate HTTP status codes based on the outcome of the operation.</remarks>
        /// <param name="genreCrudDTO">An object containing the updated information for the genre. Must not be null and should include all required
        /// fields for a valid update.</param>
        /// <returns>An IActionResult that indicates the result of the update operation. Returns a 200 OK response with a success
        /// message if the update is successful; otherwise, returns a 400 Bad Request with an error message.</returns>
        [Tags("Genres")]
        [HttpPut("genre")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateGenre([FromBody] GenreCrudDTO genreCrudDTO)
        {
            try
            {
                await _service.UpdateGenre(genreCrudDTO);
                return Ok(new { message = "Genre mis à jour avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Deletes the genre with the specified identifier.
        /// </summary>
        /// <remarks>This action requires authorization with the 'AdminOnly' policy. Only users with the
        /// appropriate permissions can perform this operation.</remarks>
        /// <param name="id">The unique identifier of the genre to delete. Must correspond to an existing genre.</param>
        /// <returns>An IActionResult that indicates the result of the deletion operation. Returns a 200 status code with a
        /// success message if the genre is deleted; otherwise, returns a 400 status code with an error message if the
        /// identifier is invalid.</returns>
        [Tags("Genres")]
        [HttpDelete("genre/{id}")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            try
            {
                await _service.DeleteGenre(id);
                return Ok(new { message = "Genre supprimé avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region TYPE_ARTISTS
        /// <summary>
        /// Retrieves all type artist records available in the system.
        /// </summary>
        /// <remarks>This method performs an asynchronous operation to fetch type artist data from the
        /// underlying service. If the operation fails, an appropriate error response is returned.</remarks>
        /// <returns>An <see cref="IActionResult"/> containing a list of <see cref="Type_ArtistsDTO"/> objects representing the
        /// type artists. Returns an HTTP 200 response with the list if successful.</returns>
        [Tags("Type Artists")]
        [HttpGet("type-artists")]
        [ProducesResponseType(typeof(List<Type_ArtistsDTO>), 200)]
        public async Task<IActionResult> GetAllTypeArtists()
        {
            var typeArtists = await _service.GetAllTypeArtists();
            return Ok(typeArtists);
        }

        /// <summary>
        /// Retrieves the type artist associated with the specified identifier.
        /// </summary>
        /// <remarks>This method returns a 404 response if no type artist is found for the given
        /// identifier.</remarks>
        /// <param name="id">The unique identifier of the type artist to retrieve. Must be a positive integer.</param>
        /// <returns>An IActionResult containing the Type_ArtistsDTO if found; otherwise, a 404 Not Found response.</returns>
        [Tags("Type Artists")]
        [HttpGet("type-artist/{id}")]
        [ProducesResponseType(typeof(Type_ArtistsDTO), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetTypeArtistById(int id)
        {
            var typeArtist = await _service.GetTypeArtistById(id);
            if (typeArtist == null)
                return NotFound(new { message = "Type d'artiste non trouvé." });
            return Ok(typeArtist);
        }

        /// <summary>
        /// Creates a new type artist using the provided data transfer object.
        /// </summary>
        /// <remarks>This action requires authorization with the 'AdminOnly' policy. Only users with the
        /// appropriate permissions can access this endpoint.</remarks>
        /// <param name="typeArtistCrudDTO">The data transfer object containing the details of the type artist to create. This parameter must not be
        /// null.</param>
        /// <returns>An IActionResult that indicates the result of the operation. Returns a 200 status code if the type artist is
        /// created successfully; otherwise, returns a 400 status code if the input data is invalid.</returns>
        [Tags("Type Artists")]
        [HttpPost("type-artist")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateTypeArtist([FromBody] Type_ArtistsCrudDTO typeArtistCrudDTO)
        {
            await _service.CreateTypeArtist(typeArtistCrudDTO);
            return Ok(new { message = "Type d'artiste créé avec succès." });
        }

        /// <summary>
        /// Updates an existing type artist with the specified details.
        /// </summary>
        /// <remarks>This method requires the caller to have the 'AdminOnly' authorization policy. If the
        /// provided data is invalid, an error message is returned in the response body.</remarks>
        /// <param name="typeArtistCrudDTO">An object containing the updated information for the type artist. This parameter must not be null and should
        /// include all required fields for the update operation.</param>
        /// <returns>An IActionResult that indicates the result of the update operation. Returns a 200 OK response with a success
        /// message if the update is successful; otherwise, returns a 400 Bad Request response with error details.</returns>
        [Tags("Type Artists")]
        [HttpPut("type-artist")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateTypeArtist([FromBody] Type_ArtistsCrudDTO typeArtistCrudDTO)
        {
            try
            {
                await _service.UpdateTypeArtist(typeArtistCrudDTO);
                return Ok(new { message = "Type d'artiste mis à jour avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Deletes the type artist identified by the specified ID.
        /// </summary>
        /// <remarks>This method requires the caller to have admin privileges. If the specified ID does
        /// not correspond to an existing type artist, an ArgumentException is thrown.</remarks>
        /// <param name="id">The unique identifier of the type artist to delete. Must be a positive integer.</param>
        /// <returns>An IActionResult that indicates the result of the delete operation. Returns 200 OK if the deletion is
        /// successful; otherwise, returns 400 Bad Request with an error message.</returns>
        [Tags("Type Artists")]
        [HttpDelete("type-artist/{id}")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> DeleteTypeArtist(int id)
        {
            try
            {
                await _service.DeleteTypeArtist(id);
                return Ok(new { message = "Type d'artiste supprimé avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region LYRICS
        /// <summary>
        /// Retrieves all lyrics available in the system.
        /// </summary>
        /// <remarks>This method is asynchronous and may take additional time to complete depending on the
        /// data source. Ensure that the service is properly initialized before calling this method.</remarks>
        /// <returns>An <see cref="IActionResult"/> containing a list of <see cref="LyricsDTO"/> objects representing the
        /// available lyrics. The list is empty if no lyrics are found.</returns>
        [Tags("Lyrics")]
        [HttpGet("lyrics")]
        [ProducesResponseType(typeof(List<LyricsDTO>), 200)]
        public async Task<IActionResult> GetAllLyrics()
        {
            var lyrics = await _service.GetAllLyrics();
            return Ok(lyrics);
        }

        /// <summary>
        /// Retrieves the lyrics associated with the specified identifier.
        /// </summary>
        /// <remarks>This method asynchronously fetches lyrics from the service. If no lyrics are found
        /// for the given identifier, a NotFound response is returned with a message indicating that the lyrics could
        /// not be located.</remarks>
        /// <param name="id">The unique identifier of the lyrics to retrieve. This parameter cannot be null or empty.</param>
        /// <returns>An IActionResult containing the lyrics data if found; otherwise, a 404 Not Found response indicating that
        /// the lyrics were not found.</returns>
        [Tags("Lyrics")]
        [HttpGet("lyrics/{id}")]
        [ProducesResponseType(typeof(LyricsDTO), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetLyricsById(string id)
        {
            var lyrics = await _service.GetLyricsById(id);
            if (lyrics == null)
                return NotFound(new { message = "Paroles non trouvées." });
            return Ok(lyrics);
        }

        /// <summary>
        /// Creates new lyrics using the provided data transfer object.
        /// </summary>
        /// <remarks>This action requires authorization with the 'AdminOnly' policy. Only users with the
        /// appropriate permissions can access this endpoint.</remarks>
        /// <param name="lyricsCrudDTO">An object containing the details of the lyrics to create. This parameter must not be null and should include
        /// all required lyrics information.</param>
        /// <returns>An IActionResult that indicates the result of the operation. Returns a 200 status code with a success
        /// message if the lyrics are created successfully; otherwise, returns a 400 status code if the input data is
        /// invalid.</returns>
        [Tags("Lyrics")]
        [HttpPost("lyrics")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateLyrics([FromBody] LyricsCrudDTO lyricsCrudDTO)
        {
            await _service.CreateLyrics(lyricsCrudDTO);
            return Ok(new { message = "Paroles créées avec succès." });
        }

        /// <summary>
        /// Updates the lyrics information for a song using the provided data transfer object.
        /// </summary>
        /// <remarks>This method requires the caller to be authorized with the 'AdminOnly' policy. Only
        /// users with the appropriate permissions can update lyrics.</remarks>
        /// <param name="lyricsCrudDTO">An object containing the updated lyrics data. Must not be null.</param>
        /// <returns>An IActionResult that indicates the result of the update operation. Returns a 200 OK response with a success
        /// message if the update is successful, or a 400 Bad Request response with an error message if the input data
        /// is invalid.</returns>
        [Tags("Lyrics")]
        [HttpPut("lyrics")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateLyrics([FromBody] LyricsCrudDTO lyricsCrudDTO)
        {
            try
            {
                await _service.UpdateLyrics(lyricsCrudDTO);
                return Ok(new { message = "Paroles mises à jour avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Deletes the lyrics associated with the specified identifier.
        /// </summary>
        /// <remarks>This method requires authorization with the 'AdminOnly' policy. It will throw an
        /// ArgumentException if the provided identifier is invalid.</remarks>
        /// <param name="id">The unique identifier of the lyrics to be deleted. This value cannot be null or empty.</param>
        /// <returns>An IActionResult indicating the result of the deletion operation. Returns a success message if the deletion
        /// is successful; otherwise, returns a bad request with an error message.</returns>
        [Tags("Lyrics")]
        [HttpDelete("lyrics/{id}")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> DeleteLyrics(string id)
        {
            try
            {
                await _service.DeleteLyrics(id);
                return Ok(new { message = "Paroles supprimées avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion
    }
}
