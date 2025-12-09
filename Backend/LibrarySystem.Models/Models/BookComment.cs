using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibrarySystem.Models.Models
{
    public class BookComment
    {
        public int Id { get; set; }
        public string? CommentText { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int BookId { get; set; }
        public Book Book { get; set; }
        public string userId { get; set; }
        public AppUser AppUser { get; set; }
    }
}
