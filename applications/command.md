---
title: Command
summary: "Metalama.Patterns.Wpf automates WPF command implementation, enhancing productivity by reducing boilerplate code and supporting `CanExecute` logic."
keywords: "WPF command implementation, ICommand, CanExecute, Metalama.Patterns.Wpf, boilerplate code, command automation"
---

{: .intro }
One of the [best practices](https://metalama.net/blog/wpf-best-practices-2024) in WPF is to implement the logic behind buttons and menu items as a Command (`ICommand`) instead of a simple event handler. However, WPF commands require some redundant code, especially to integrate the `CanExecute` logic.

{: .intro }
The [Command](https://doc.metalama.net/patterns/wpf/command) aspect of the `Metalama.Patterns.Wpf` open-source package solves this problem by automatically generating the plumbing code.

{: .note }
`Metalama.Patterns.Wpf` is a production-ready, professionally-supported, and open-source aspect library. <i class="supported no-tooltip"></i>

{: .note }
Available for WPF only.


## Example

In the following example, the `[Command]` aspect will generate an `ExecuteSaveCommand` property based on the `ExecuteSave` method and the `CanExecuteSave` property.

```csharp
[Observable]
public partial class MainWindow : Window
{
    public bool HasChanges { get; private set; };

    // [<focus>]
    [Command]
    // [<endfocus>]
    public void ExecuteSave()
    {
        // Details skipped.
    }

    public bool CanExecuteSave => this.HasChanges;
}
```

## Benefits

* **Boost your productivity**. Minimize boilerplate code to implement ICommand properties.
* **Keep your code clean and concise**. Your business logic is easier to read and less entangled.
* **Reduce human errors**. Eliminate repetitive code that is prone to mistakes.
* **Improve maintainability**. Keep your codebase clean and easier to understand.
* **Seamless integration**. Works with existing WPF projects without requiring major refactoring.

## Features

* Idiomatically C#: Metalama works _with_ your code, not against it.
* Supports simple, parameterized, async, and background commands.
* Integrates with the `[Observable]` aspect to handle the `CanExecute` functionality without boilerplate.

## Resources

* Blog post: [Implementing WPF Commands with Metalama](https://metalama.net/blog/wpf-command-metalama).
* Reference documentation: [WPF Commands](https://doc.metalama.net/patterns/wpf/command).
* Source code: [Metalama.Patterns.Wpf](https://github.com/metalama/Metalama.Patterns/tree/HEAD/src/Metalama.Patterns.Wpf).
* NuGet package: [Metalama.Patterns.Wpf](https://www.nuget.org/packages/Metalama.Patterns.Wpf).
