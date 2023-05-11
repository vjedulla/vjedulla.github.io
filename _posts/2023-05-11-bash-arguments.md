---
layout: post
title: Bash arguments
subtitle: handle the terminal headaches.
date:   2023-05-11
tags: [quickie, bash, engineering]
---

This post is going to be quick and concise. The main purpose of this script is to define
required and optional named arguments in bash. This script is intended to be used as a 
parser of arguments and showing example usage. Later I will show you how can you include it 
in your own bash scripts.

{: .box-note}
**Problem:** 
Lets say we have a script that tries to deploy some cloud resources 
and parse some settings for those resources, where we have a default behavior for most resources 
except for one.

{% highlight bash linenos %}
#!/bin/bash

# Function to display usage instructions
display_usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  --resource1  <value>     Resource name value (required)"
    echo "  --resource2  <value>     Resource name value (required)"
    echo "  --log_mode   <value>     Setting value (optional, default=debug)"
    echo "  --output     <value>     Setting value (optional, default=s3)"
    echo "  --format     <value>     Setting value (optional, default=json)"
    exit 1
}

# Function to parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        key="$1"
        case $key in
            --resource1)
                resource1="$2"
                shift
                ;;
            --resource2)
                resource2="$2"
                shift
                ;;
            --log_mode)
                log_mode="$2"
                shift
                ;;
            --output)
                output="$2"
                shift
                ;;
            --format)
                format="$2"
                shift
                ;;
            *)
                # Unknown option
                echo "Unknown option: $key"
                display_usage
                ;;
        esac
        shift
    done

    # Check for required parameters
    if [[ -z $resource1 ]]; then
        echo "Missing required parameter: --resource1 (example: db_instance)"
        display_usage
    fi

    if [[ -z $resource2 ]]; then
        echo "Missing required parameter: --resource2 (example: db_instance)"
        display_usage
    fi


    # Set default values for optional parameters
    if [[ -z $log_mode ]]; then
        # optional
        log_mode=debug
    fi

    if [[ -z $output ]]; then
        # optional
        output=s3
    fi

    if [[ -z $format ]]; then
        # optional
        format=json
    fi
}

# Call the argument parsing function
parse_arguments "$@"

# Display the parsed values
echo "Resource 1: $resource1"
echo "Resource 2: $resource2"
echo "Settings: $log_mode, $output, $format"
{% endhighlight %}

We can save this script with the name `parser_helper.sh` and we can use it in another script as such:

{% highlight bash linenos %}
#!/bin/bash

# include parser
source parser_helper.sh

# Commands in logic.sh
...
{% endhighlight %}