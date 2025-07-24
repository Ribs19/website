---
title: "Decorator Pattern"
summary: "The Decorator pattern adds behaviors to objects without altering their structure, using Metalama for static implementation."
keywords: "Decorator pattern, structural design pattern, Metalama, static implementation"
---

The Decorator pattern is a structural design pattern that allows you to add new behaviors to objects. It is a good alternative to subclassing because it allows you to add new functionalities to objects without changing their structure.

Metalama seems like it was _invented_ to easily implement decorators. If you want to apply decorators _statically_ to your code, just use the [OverrideMethodAspect](https://doc.metalama.net/api/metalama-framework-aspects-overridemethodaspect), [OverrideFieldOrPropertyAspect](https://doc.metalama.net/api/metalama-framework-aspects-overridefieldorpropertyaspect), or [OverrideEventAspect](https://doc.metalama.net/api/metalama-framework-aspects-overrideeventaspect) according to what you want to decorate.

If you want to _dynamically_ apply decorators at runtime, see the Proxy pattern.

## Example

The `Retry` aspect can be applied to a method as a custom attribute:

```cs
// [<focus>]
[Retry]
// [<endfocus>]
public void Send( Message message )
{
    Console.WriteLine( "Sending message..." );

    // Simulate unreliable message sending
    if ( ++this._sendCount % 3 == 0 )
    {
        Console.WriteLine( "Message sent successfully." );
    }
    else
    {
        throw new IOException( "Failed to send message." );
    }
}
```

When you compile, Metalama generates the following code for you:

```cs
[Retry]
public void Send( Message message )
{
    // [<added>]
    for ( var i = 0;; i++ )
    {
        try
        {
            // [<endadded>]
            Console.WriteLine( "Sending message..." );
        
            // Simulate unreliable message sending
            if ( ++this._sendCount % 3 == 0 )
            {
                Console.WriteLine( "Message sent successfully." );
            }
            else
            {
                throw new IOException( "Failed to send message." );
            }

            // [<added>]
        }
        catch ( Exception e ) when ( i < 3 )
        {
            var delay = this.Delay * Math.Pow( 2, i + 1 );

            Console.WriteLine(
                $"Method Broker.Send has failed " +
                $" on {e.GetType().Name}. Retrying in {delay / 1000} seconds... ({i + 1}/3)" );

            Thread.Sleep( (int) delay );
        }
    }
    // [<endadded>]
}
```


Thanks to the `[Retry]` aspect, this method never fails!

{: .show-more }
Show me how it works!

The `[Retry]` aspect implements a decorator that retries the execution of a method upon exception:

```cs
internal class RetryAttribute : OverrideMethodAspect
{
    public int Attempts { get; set; } = 5;
    public double Delay { get; set; } = 1000;

    public override dynamic? OverrideMethod()
    {
        for ( var i = 0;; i++ )
        {
            try
            {
                return meta.Proceed();
            }
            catch ( Exception e ) when ( i < this.Attempts )
            {
                var delay = this.Delay * Math.Pow( 2, i + 1 );

                Console.WriteLine(
                    $"Method {meta.Target.Method.DeclaringType.Name}.{meta.Target.Method} has failed " +
                    $" on {e.GetType().Name}. Retrying in {delay / 1000} seconds... ({i + 1}/{this.Attempts})" );

                Thread.Sleep( (int) delay );
            }
        }
    }
}
```

## Metalama benefits

* **Use decorators everywhere**: With Metalama, we’re not limited to virtual or interface methods (such as with the Proxy pattern); we can intercept anything, even static private fields. This allows you to use the Decorator pattern throughout your code.
* **Keep your code clean**: It's a great way to add new functionalities to objects without changing their structure. It allows you to keep your code clean and maintainable.
* **Improve your code quality**: The generated code is always consistent with the design pattern rules. Every time you apply the aspect, you can be sure that the code is compliant with the Decorator pattern.

## Resources

* Blog post: [The Decorator Pattern in Modern C#](https://metalama.net/blog/decorator-pattern)
