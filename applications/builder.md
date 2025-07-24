---
title: "Builder Pattern"
summary: "The Builder pattern constructs complex objects step by step but requires much boilerplate code, which Metalama can help reduce."
keywords: "Builder pattern, creational design pattern, immutable object, abstraction"
---

{: .intro }
The Builder pattern is a creational design pattern that allows you to construct complex objects step by step. It is especially useful when you need to create an immutable object with many optional parameters or properties. A variant of this pattern, the Abstract Builder, adds abstraction to the construction process.

The main inconvenience of the Builder pattern is the large amount of repetitive code required to implement it. This can be virtually eliminated with a Metalama aspect.

## Example

In the following example, we will use the `Song` class for the Builder pattern. The `Song` class has two required properties (`Artist` and `Title`) and two optional properties (`Duration` and `Genre`).

```cs
[GenerateBuilder]
public partial class Song
{
    [Required] public string Artist { get; }
    [Required] public string Title { get; }
    public TimeSpan? Duration { get; }
    public string Genre { get; } = "General";
}
```

The `GenerateBuilder` aspect generates all the necessary code on the fly. We can use the `Song` class as follows:

```cs
var songBuilder = new Song.Builder( "Joseph Kabasele", "Indépendance Cha Cha" );
songBuilder.Genre = "Congolese rumba";
var song = songBuilder.Build();
```

{: .show-more }
Show me how it works!

The [GenerateBuilder](https://doc.metalama.net/examples/builder) aspect generates a `Builder` class nested inside the `Song` class and a `ToBuilder` method to create a new `Builder` object.

```cs
public partial class Song
{

  public Builder ToBuilder() => new Builder(this);

  public class Builder
  {
    public Builder(string artist, string title)
    {
      Artist = artist;
      Title = title;
    }

    internal Builder(Song source)
    {
      Artist = source.Artist;
      Title = source.Title;
      Duration = source.Duration;
      Genre = source.Genre;
    }

    public string Artist { get; set; }
    public TimeSpan ? Duration { get; set; }
    public string Genre { get; set; } = "General";
    public string Title { get; set; }

    public Song Build()
    {
      var instance = new Song(Artist, Title, Duration, Genre) !;
      return instance;
    }
  }
}
```

That's a lot of boilerplate you want to avoid!

## Metalama benefits

* **Improve productivity**: Any generated code is code you don't have to write and maintain.
* **Reduce human errors**: Whenever you have to add new optional (or required) properties to the `Song` class, the aspect will take care of it. It's the best way to avoid having to remember to update the Builder class manually by adding new fields, properties, and the necessary mappings to move the value of that new Builder property to the `Song` class.

## Resources

* Blog post: [Implementing the Builder pattern with Metalama](https://metalama.net/blog/builder-pattern-with-metalama)
* Example: [Implementing the Builder pattern without boilerplate](https://doc.metalama.net/examples/builder)
