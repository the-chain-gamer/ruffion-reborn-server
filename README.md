Ruffion Reborn Game Server
=================================

## Environment Setup

1. Clone Repository and ensure that you are using authorized credentials

2. Install runtime and dependencies

    ```bash
    npm install --global yarn
    yarn install
    ```
3. Check the `env/dev.env` file inside root directory and setup the database according to the properties in .env.example

4. Start Develop Server

    ```bash
    yarn develop

    # Or start in repl mode
    yarn develop:repl
    ```

For more commands, see `scripts` inside `package.json`.

<br>



## Code Formatting

Always ensure that all code is correctly formatted whenever you make changes:

```bash
$ yarn format
```
