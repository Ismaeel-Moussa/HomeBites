using DataAccess.Entities;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; // e.g. "Desserts"
    public ICollection<Dish> Dishes { get; set; } = new List<Dish>();
}