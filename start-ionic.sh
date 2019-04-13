(
    trap '
        echo "Script error. ($LINENO)"
        return
    ' ERR
    app_name=${1//[^a-zA-Z]/}
    [ "$app_name" != "" ] && {
        ionic start client
        cd client
        npm install @angular/material @angular/cdk @angular/animations
    } || {
        echo "=====USAGE====="
        echo ". $BASH_SOURCE <application name>"
        echo "  # <application name>: Alphabet letter only"
    }
)
