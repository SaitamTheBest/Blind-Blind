using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.Logs
{
    [Table("log_http", Schema = "blindblindv1_dataAdmin")]
    public class HttpLog
    {
        [Key]
        [Column("id_log")]
        public int Id_Log { get; set; }

        [Column("method")]
        public string Method { get; set; } = null!;

        [Column("endpoint")]
        public string Endpoint { get; set; } = null!;

        [Column("ip_address")]
        public string? IpAddress { get; set; }

        [Column("status_code")]
        public int StatusCode { get; set; }

        [Column("duration_ms")]
        public int DurationMs { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
