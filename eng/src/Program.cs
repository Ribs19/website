// Copyright (c) SharpCrafters s.r.o. See the LICENSE.md file in the root directory of this repository root for details.

using PostSharp.Engineering.BuildTools;
using PostSharp.Engineering.BuildTools.Build.Model;
using PostSharp.Engineering.BuildTools.Search;
using PostSharp.Engineering.BuildTools.Search.Crawlers;
using PostSharpDocumentationDependencies = PostSharp.Engineering.BuildTools.Dependencies.Definitions.PostSharpDependencies;

const string docPackageFileName = "PostSharp.Doc.zip";

var product = new Product( PostSharpDocumentationDependencies.PostSharpDocumentation )
{
  //  AddDefaultCommands = false,
    Extensions =
    [
        // Run `b generate-scripts` after changing these parameters.
        new UpdateSearchProductExtension(
            "https://typesense.postsharp.net",
            "metalamaweb",
            "https://metalama.net/sitemap.xml",
            () => new PlainDocumentParser( ["//main"] ),
            ["Metalama"] ) 
    ]
};

var app = new EngineeringApp( product );
return app.Run( args );