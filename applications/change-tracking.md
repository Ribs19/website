---
title: Change Tracking
summary: "The document explains implementing change tracking in .NET UIs using `IChangeTracking` and `IRevertibleChangeTracking` interfaces with Metalama."
keywords: "change tracking, IChangeTracking, IRevertibleChangeTracking, Dirty Flag, Metalama, code generation, property instrumentation"
---

{: .intro }
When programming UIs, especially "transactional" UIs with _Ok_ buttons, it's necessary to detect whether a data object has been modified. This feature is often called the _Dirty Flag_. It allows, for instance, enabling or disabling the _Save_ button. In .NET, this behavior is abstracted by the `IChangeTracking` interface. Another interface, `IRevertibleChangeTracking`, supports the _Reset_ feature.

Here is the definition of these system interfaces:

```csharp
public interface IChangeTracking
{
  bool IsChanged { get; }
  void AcceptChanges();
}

public interface IRevertibleChangeTracking : IChangeTracking
{
  void RejectChanges();
}
```

Implementing these interfaces manually requires a lot of work because it is necessary to instrument every property setter or any method modifying fields.

Generating code in properties and fields is exactly where Metalama excels.

You can create an aspect that adds the `IChangeTracking` or `IRevertibleChangeTracking` interface to the target type and instruments all fields and properties to set the `IsChanged` property.

## Example

Implementing `IChangeTracking` or even `IRevertibleChangeTracking` in the following classes can be as easy as adding a `[TrackChanges]` custom attribute. We made a slight modification to the .NET pattern: we require an `IsTrackingChanges` property to be enabled for change tracking to work.

```csharp
[TrackChanges]
public partial class Comment
{
    public Guid Id { get; init; }
    public required string Author { get; set; }
    public required string Content { get; set; }
}

public class ModeratedComment : Comment
{
    public bool? IsApproved { get; set; }
}
```

Let's see this aspect in action.

```csharp
var comment = new ModeratedComment
{
    Id = Guid.NewGuid(),
    Author = "Cicero",
    Content = "Non nobis solum nati sumus",

    // Must be the last one.
    IsTrackingChanges = true
};

Console.WriteLine($"IsChanged={comment.IsChanged}");

comment.IsApproved = true;
Console.WriteLine($"IsChanged={comment.IsChanged}");

comment.AcceptChanges();
Console.WriteLine($"IsChanged={comment.IsChanged}");
```

The program prints the following text:

```text
IsChanged=False
IsChanged=True
IsChanged=False
```

{: .show-more }
Show me how it works!

The [TrackChanges](https://doc.metalama.net/examples/change-tracking/change-tracking-1) aspect transforms the `Comment` class into this:

```csharp
public partial class Comment : ISwitchableChangeTracking, IChangeTracking
{
    private string _author;
    private string _content;

    public required Guid Id { get; init; }

    public required string Author
    {
        get => this._author;
        set
        {
            if (value != this._author)
            {
                this._author = value;
                OnChange();
            }
       }
    }

    public required string Content
    {
        get => this._content;

        set
        {
            if (value != this._content)
            {
                this._content = value;
                OnChange();
            }
        }
    }

    public bool IsChanged { get; private set; }
    public bool IsTrackingChanges { get; set; }

    public void AcceptChanges()
    {
        IsChanged = false;
    }

    protected void OnChange()
    {
        if (IsTrackingChanges)
        {
            IsChanged = true;
        }
    }
}
```

A [more complex variant](https://doc.metalama.net/examples/change-tracking/change-tracking-3) of the aspect can integrate with the `INotifyPropertyChanged` interface or implement the `RejectChanges` functionality.

## Metalama benefits

- Enhance productivity and reduce boilerplate code by automating property and field instrumentation.
- Improve code readability.
- Ensure consistency and reduce human error in implementing change tracking.
- Simplify maintenance by centralizing logic in one aspect class.

## Resources

* Example: [Change tracking](https://doc.metalama.net/examples/change-tracking)
