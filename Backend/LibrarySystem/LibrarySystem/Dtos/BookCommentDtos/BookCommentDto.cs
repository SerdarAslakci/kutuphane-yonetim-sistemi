namespace LibrarySystem.API.Dtos.BookCommentDtos
{
    public class BookCommentDto
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string UserId { get; set; }
        public string UserFullName { get; set; }
        public string Content { get; set; }
        public int Rating { get; set; }
        public string CreatedAt { get; set; }
    }
}
