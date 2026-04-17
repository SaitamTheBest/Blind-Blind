namespace Blind_Blind_Backend.DTOs.DataAdmin
{
    public class AnnouncementCreateDTO
    {
        public string Title { get; set; }
        public string Short_Description { get; set; }
        public string Cover_Image { get; set; }
        public string Content { get; set; }
        public DateTime? Publication_Date { get; set; }
        public int Id_Announcement_Type { get; set; }
        public bool Is_Published { get; set; } = false;
        public string Slug { get; set; }
    }
}
