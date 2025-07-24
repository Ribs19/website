---
title: "Exception Handling"
summary: "This article shows how to use Metalama to improve the resilience and performance of .NET/C# apps by adding exception handling, caching, and other policies."
keywords:
- .net resilience
- c# exception handling
- polly c#
- .net polly
---

{: .intro }
Resilience refers to a system's ability to recover gracefully from failures, handle unexpected situations, and continue delivering what it's supposed to do. To achieve this, engineers use key resilience patterns like circuit breakers, retries, fallbacks, and throttling.

Adding resilience into a codebase usually requires writing boilerplate code, which is often tedious, unproductive, and error-prone.

Let's see how Metalama helps.

## Resilience with Polly

Polly is the go-to library for implementing resilience in .NET. It implements the most-used policies, is actively maintained, and there is probably no need to reinvent the wheel.

However, adding Polly to your code can still require some boilerplate code: you still need to pull dependencies and wrap all methods into delegate calls—for each method.

With Metalama, you can add Polly without any boilerplate.

### Benefits

Compared to adding Polly manually, adding it with Metalama has the following benefits:

- **Clean code**: There's no need to wrap your code in a delegate call, so it remains crystal clear and is easier to maintain.
- **Easily modify the pattern**: You can easily replace Polly with another library or remove it altogether if you want.

### Example

You can create an `[AddPolicy]` Metalama aspect that pulls the Polly dependency and wraps your method into a delegate code:

```cs
public class CalculatorService
{
    // [<focus>]
    [AddPolly( "MyPolicy" )]
    // [<endfocus>]
    public int Add( int a, int b )
    {
        // Your code here
        return a + b;
    }
}
```

See [this commented example](https://doc.metalama.net/examples/exception-handling/retry/retry-5) to learn how to create such aspects.

{: .show-more }
Show me my transformed code!

Here is what the `[AddPolly]` aspect may do to your code.

{% raw %}
```cs
internal class CalculatorService
{
   private ILogger _logger;
   private IPolicyFactory _policyFactory;

    public CalculatorService(ILogger<RemoteCalculator> logger, IPolicyFactory? policyFactory)
    {
        this._logger = logger;
        this._policyFactory = policyFactory;
    }

    public int Add(int a, int b)
    {
// [<added>]
        object? ExecuteCore()
        {
            try
            {
// [<endadded>]
                // Your code here.
                return a + b;
// [<added>]
            }
            catch (Exception e)
            {
                _logger.LogWarning(
                    $"CalculatorService.Add(a = {{{a}}}, b = {{{b}}}) has failed: {e.Message}");
                throw;
            }
        }

        var policy = _policyFactory.GetPolicy(PolicyKind.Retry);
        return (int)policy.Execute(ExecuteCore);
// [<endadded>]
    }
}
```
{% endraw %}

### Resources

* Example: [Implementing an auto-retry aspect that uses Polly](https://doc.metalama.net/examples/exception-handling/retry/retry-5)
* Blog: [5 practical ways to add Polly to your application](https://metalama.net/blog/polly)

## Resilience without Polly

You can, of course, create exception-handling aspects without Polly. See [these examples](https://doc.metalama.net/examples/exception-handling) to get some inspiration.

## Enriching exception stacks

In diagnosing software problems, context is everything. Exception call stacks are a good example of this context, but they are not enough: they lack parameter values that give you an idea of the application state.

You can use an aspect to **append the parameter values** to any `Exception` flying through your method. When reporting the exception, you can add the parameter values to the call stack.

### Example

Suppose we have the following exception:

```text
System.NullReferenceException: Object reference not set to an instance of an object
   at CustomerService.GetCustomerCreationDate(Int32)
   at HomeController.Index()
   ...
```

To continue your investigation, you would need to know for which value of `customerId` the `GetCustomer` method returns `null`.

You create an `EnrichExceptionAttribute` aspect that automatically wraps the whole method body in a try-catch block and enriches the exception with the parameter values. You can [see the full code of that aspect here](https://doc.metalama.net/examples/exception-handling/enrich-exception#aspect-code).

However, solely defining an aspect is not enough. You need to apply it to all your methods, so you add this class to your project:

```csharp
internal class Fabric : ProjectFabric
{
    public override void AmendProject(IProjectAmender amender) =>
        amender
            .SelectTypes()
            .SelectMany(type => type.Methods)
            .AddAspectIfEligible<EnrichExceptionAttribute>();
}
```

Now, instead of just reporting `exception.ToString()`, you can append the result of `exception.GetContextInfo()` to get the following exception stack:

```text
System.NullReferenceException: Object reference not set to an instance of an object
   at CustomerService.GetCustomerCreationDate(Int32)
   at HomeController.Index()
   ...
with
  CustomerService.GetCustomerCreationDate(123)
```

Now you see (at the bottom of the block) for which value of `customerId` your code fails.

{: .show-more }
Show me how it works!

The problematic code is the following:

```csharp
public string GetCustomerCreationDate( int customerId )
    => _customerDb.GetCustomer( customerId ).CreationData;
```

When you build the project, the fabric added the [EnrichException](https://doc.metalama.net/examples/exception-handling/enrich-exception#aspect-code) aspect to any public method, including this one. Therefore, instead of your source code, the following code is executed:

```cs
public string GetCustomerCreationDate( int customerId )
{
  try
  {
    return _customerService.GetCustomer( customerId ).CreationData;
  }
  catch (Exception e)
  {
    e.AppendContextFrame($"CustomerService.GetCustomerCreationDate({customerId})");
    throw;
  }
}
```

In this example, the `AppendContextFrame` is just a method that appends the parameter values to the exception message, providing additional context information that can help developers quickly identify the cause of the error.

### Metalama benefits

- **You can just do it!** You would probably not be willing to implement this trick if it were not _free_. With Metalama, you can just do it.
- **Clean code.** The exception handling code is generated on-the-fly during compilation, so your code remains crystal clear and is easier to maintain.
- **Easily add or remove.** You can add or remove the feature at any time. You can also enable logging only in select build configurations.

### Resources

* Example: [Enriching exceptions with parameter values](https://doc.metalama.net/examples/exception-handling/enrich-exception)
