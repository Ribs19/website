---
title: "SOLID & DRY Principles in C#"
short_title: "SOLID & DRY Principles"
summary: "This article explains how Metalama can help improve SOLID and DRY principles in .NET and C# codebases."
keywords:
- solid principles c#
- dry principle c#
---

{: .intro }
SOLID and DRY principles are universally accepted guidelines in software engineering. Metalama enables you to implement, improve, or promote these principles in your C# code.

The _SOLID principles_ consist of five design principles that help create well-structured, maintainable, and scalable software:

- **S**ingle Responsibility Principle (SRP)
- **O**pen/Closed Principle (OCP)
- **L**iskov Substitution Principle (LSP)
- **I**nterface Segregation Principle (ISP)
- **D**ependency Inversion Principle (DIP)

DRY stands for _Don't Repeat Yourself_. It simply states that you should avoid duplicating code in your codebase.

We'll show you how to use Metalama to implement the SRP, OCP, DIP, and DRY principles.

## Single Responsibility Principle (SRP)

***"A class should have only one reason to change."***

This means that a class should have only one responsibility. If not, it should be refactored into multiple classes, each with a single responsibility.

Although we can't use Metalama to ensure that a class has only one responsibility, we can use it once you've identified which responsibility doesn't belong to the class. For example, you can use Metalama to move cross-cutting concerns into their own classes, such as logging, validation, and caching.

For instance, let's say we have a `TaxCalculator` class with a `GetTaxAmount` method.

```cs
public class TaxCalculator
{
    public decimal GetTaxAmount(Invoice invoice)
    {
        Console.WriteLine($"Calculating tax for invoice ID {invoice.Id}");

        if (invoice == null) throw new ArgumentNullException(nameof(invoice));

        var taxPercent = GetTaxPercent(invoice.CategoryId);
        var taxAmount = invoice.Amount * taxPercent / 100;

        Console.WriteLine($"Tax calculated: {taxAmount:C} for invoice ID {invoice.Id}");
        return taxAmount;
    }

    private decimal GetTaxPercent(int categoryId)
    {
        // Simulate fetching from a database
        return FetchTaxPercentFromDatabase(categoryId);
    }
}
```

The `GetTaxAmount` method is responsible for adding two numbers, but it also logs the start and end of the method and logs any exceptions that occur. This means that the `GetTaxAmount` method has more than one responsibility.

To remove the logging responsibility from the `GetTaxAmount` method, we can move all the logging code to a Metalama aspect (a separate class) like the `Log` attribute introduced in the [Implementing logging without boilerplate](https://doc.metalama.net/examples/log) article.

Using that new `Log` attribute, the `TaxCalculator` class will look like this:

```cs
public class TaxCalculator
{
    // [<focus>]
    [Log]
    // [<endfocus>]
    public decimal GetTaxAmount(Invoice invoice)
    {
        if (invoice == null) throw new ArgumentNullException(nameof(invoice));

        var taxPercent = GetTaxPercent(invoice.CategoryId);
        var taxAmount = invoice.Amount * taxPercent / 100;

        return taxAmount;
    }

    private decimal GetTaxPercent(int categoryId)
    {
        // Simulate fetching from a database
        return FetchTaxPercentFromDatabase(categoryId);
    }
}
```

Now the `GetTaxAmount` method only has one responsibility: adding two numbers. The logging responsibility has been moved to the `Log` attribute.

Another way to implement the Single Responsibility Principle is to use the Decorator design pattern. You can use this pattern to add the logging behavior to a class without changing its existing code. To implement this pattern with Metalama, you can follow the steps in the [The Decorator Pattern in Modern C# [2024]](https://metalama.net/blog/decorator-pattern) article.

## Open/Closed Principle (OCP)

***A class should be open for extension but closed for modification.***

This means that you should be able to add new functionality to a class without changing its existing code.

Aspects are a great way to add new functionalities to classes without changing their existing code. Consider the `TaxCalculator` class from the previous example. If you want to add logging behavior to the `GetTaxAmount` method, you can use the `Log` attribute to add this behavior without changing the `TaxCalculator` class.

```cs
public class TaxCalculator
{
    [Log]
    public decimal GetTaxAmount(Invoice invoice)
    {
        if (invoice == null) throw new ArgumentNullException(nameof(invoice));

        var taxPercent = GetTaxPercent(invoice.CategoryId);
        var taxAmount = invoice.Amount * taxPercent / 100;

        return taxAmount;
    }

    [Log]
    [Cache]
    private decimal GetTaxPercent(int categoryId)
    {
        // Simulate fetching from a database
        return FetchTaxPercentFromDatabase(categoryId);
    }
}
```

In this example, the `Cache` attribute (part of the [Metalama Patterns](https://doc.metalama.net/patterns/caching)) is used to add caching behavior to the `GetTaxAmount` method. The `TaxCalculator` class is open for extension because you can add new functionalities to it (using attributes in this case) but closed for modification because you don't need to change the existing code of the class.

Metalama also provides something called [Fabrics](https://doc.metalama.net/conceptual/using/fabrics) to add multiple aspects at once using compile-time imperative code, as opposed to the declarative custom attributes we used in the previous example. Why should you need to do this? Because sometimes you need to add aspects dynamically, based on some conditions to several classes/methods at once.

The following snippet adds logging to all public methods of public types (except `ToString`):

```cs
internal class Fabric : ProjectFabric
{
    public override void AmendProject(IProjectAmender amender) =>
        amender
            .SelectTypes()
            .Where(type => type.Accessibility == Accessibility.Public)
            .SelectMany(type => type.Methods)
            .Where(method =>
                method.Accessibility == Accessibility.Public && method.Name != "ToString")
            .AddAspectIfEligible<LogAttribute>();
}
```

## Dependency Inversion Principle (DIP)

***High-level modules should not depend on low-level modules. Both should depend on abstractions.***

This means that you should depend on abstractions, not on concrete implementations.

This is another principle that the use of Metalama aspects helps improve. Consider the `TaxCalculator` class from previous examples. The first version of the class had a dependency on the logging mechanism (in this case just a `Console.WriteLine` method, but it could be easily replaced by a more complex logging mechanism generating a stronger dependency).

The final version of the `TaxCalculator` class, thanks to Metalama aspects, depends on the `Log` aspects, not on their concrete implementations. This means that the `TaxCalculator` class depends on abstractions, not on concrete implementations. You can start logging with the `Console.WriteLine` method and then switch to a more complex logging mechanism without changing the `TaxCalculator` class.

## Don't Repeat Yourself Principle (DRY)

In C# development, there are many opportunities to repeat code. For example, you may encounter scenarios where you need to:

1. Write the same validation logic in multiple classes or methods.
2. Implement identical logging logic across different classes or methods.
3. Apply consistent caching logic in numerous classes or methods.
4. Implement the INotifyPropertyChanged interface in multiple classes.
5. Develop cumbersome code when using the Builder design pattern.

Metalama helps you avoid code duplication by allowing you to define reusable aspects that can be applied to multiple classes or methods. This way, you can write the validation, logging, caching, and other logic once and apply it to multiple classes or methods.

Let's take a look at an example where we apply the DRY principle using Metalama. Suppose you have a `Person` class that implements the `INotifyPropertyChanged` interface. You can use Metalama to avoid writing the same boilerplate code in multiple classes.

```cs
[Observable]
public class Person
{
  public string Name { get; set; }
  public int Age { get; set; }
}
```

{: .show-more }
How much code have we saved?

The use of the `[Observable]` attribute generates the boilerplate code required to implement the `INotifyPropertyChanged` interface. Take a look at how much code you saved using Metalama:

```cs
public class Person : INotifyPropertyChanged
{
  public event PropertyChangedEventHandler PropertyChanged;

  private string name;
  public string Name
  {
    get => name;
    set
    {
      if (name != value)
      {
        name = value;
```
```csharp
PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Name)));
  }
}

private int age;
public int Age
{
  get => age;
  set
  {
    if (age != value)
    {
      age = value;
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Age)));
    }
  }
}
```
The amount of repetitive code here is significant and likely something you'd want to minimize!
