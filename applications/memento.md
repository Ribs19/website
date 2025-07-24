---
title: "Memento Pattern"
summary: "The Memento pattern captures an object's state without violating encapsulation, useful for undo/redo functionality and state restoration. It can be automatically implemented using Metalama."
keywords: "Memento pattern, encapsulation, undo/redo functionality, state restoration, Metalama, boilerplate code, design patterns"
---

The Memento pattern is a classic behavioral design pattern used to capture the internal state of an object without violating its encapsulation. It allows you to save the state of an object and later restore it. The Memento pattern is useful in many scenarios, such as implementing undo/redo functionality, saving and restoring the state of an object, or saving the state of an object to a file.

As the Memento pattern involves a lot of boilerplate code, it is a good candidate for automatic creation by Metalama.

## Example

In the following example, the `[Memento]` custom attribute is all you need to implement the Memento pattern on the `Fish` class.

```cs
// [<focus>]
[Memento]
// [<endfocus>]
public sealed partial class Fish
{
    public string? Name { get; set; }
    public string? Species { get; set; }
    public DateTime DateAdded { get; set; }
}
```

The aspect implements the `IMementoable` interface, including its `SaveToMemento` and `RestoreMemento` methods.

```cs
var fish = new Fish() { Name = "Hannibal", Species = "Tilapia" };

// Save
var memento = fish.SaveToMemento();

// Change
fish.Tilapia = "Shark";

// Undo change
fish.RestoreMemento(memento);
```

{: .show-more }
Show me how it works!

The aspect, once applied, will create an internal `Memento` class to capture the state of the `Fish` class. The `Fish` class will also have a `SaveToMemento` method and a `RestoreMemento` method to save and restore the state of the `Fish` object.

```cs
// [<added>]
public partial class Fish : IMementoable
{
  public void RestoreMemento(IMemento memento)
  {
    var typedMemento = (Memento) memento;
    this.Name = typedMemento.Name;
    this.Species = typedMemento.Species;
    this.DateAdded = typedMemento.DateAdded;
  }

  public IMemento SaveToMemento()
   => new Memento(this);

  private class Memento: IMemento
  {
    public Memento(Fish originator)
    {
      this.Originator = originator;
      this.Name = originator.Name;
      this.Species = originator.Species;
      this.DateAdded = originator.DateAdded;
    }

    public string? Name { get; }
    public string? Species { get; }
    public DateTime DateAdded { get; }
    public IMementoable? Originator { get; }
  }
}
// [<endadded>]
```

You can find the complete `Memento` aspect source code [here](https://doc.metalama.net/preview/examples/memento/memento-1#complete-aspect).

## Metalama benefits

* **Increase your productivity**: The pattern requires a lot of boilerplate code. Instead of writing it manually, an aspect can handle it for you, allowing you to focus exclusively on your business logic.
* **Keep your code consistent**: The generated code is always consistent with the pattern rules.
* **Enhance maintainability**: The generated code will always be up-to-date; you'll never forget to update the Memento class when you add a new property to the *Mementoable* class.

## Resources

* Blog post: [The Memento Design Pattern in C#, Practically With Examples [2024]](https://metalama.net/blog/memento)
* Example: [Implementing the Memento pattern without boilerplate](https://doc.metalama.net/examples/memento)
