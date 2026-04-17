namespace Blind_Blind_Backend.DTOs.DataAdmin
{
    public class AnnouncementDTO
    {
        public int Id_Announcement { get; set; }
        public string Title { get; set; }
        public string Short_Description { get; set; }
        public string Cover_Image { get; set; }
        public string Content { get; set; }
        public DateTime? Publication_Date { get; set; }
        public DateTime Created_At { get; set; }
        public DateTime? Updated_At { get; set; }
        public int Id_Announcement_Type { get; set; }
        public string Id_Author { get; set; }
        public bool Is_Published { get; set; }
        public string Slug { get; set; }
        public Announcement_TypeDTO Announcement_Type { get; set; }
        public string Author_Name { get; set; }
    }
}
