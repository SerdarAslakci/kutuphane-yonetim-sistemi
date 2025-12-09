namespace LibrarySystem.API.Dtos.BookCommentDtos
{
    public class AddBookCommentDto
    {
        public int bookId { get; set; }
        public string content { get; set; }
        public int rating { get; set; }
    }
}
