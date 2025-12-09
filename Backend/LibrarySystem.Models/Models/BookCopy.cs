using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibrarySystem.Models.Models
{
    public class BookCopy
    {
        public int Id { get; set; }
        public string BarcodeNumber { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public int BookId { get; set; }
        public int ShelfId { get; set; }
        public Book? Book { get; set; }
        public Shelf? Shelf { get; set; }
        public ICollection<Loan> Loans { get; set; } = new List<Loan>();
    }
}
