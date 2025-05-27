flowchart TB
    %% Browser Client
    Browser["User Agent"]:::external

    %% React App Shell
    subgraph "React App Shell"
        IndexHTML["index.html"]:::build
        MainJSX["src/main.jsx"]:::frontend
        AppJSX["src/App.jsx"]:::frontend
    end

    %% UI Layout Layer
    subgraph "UI Layout Layer"
        Header["Header"]:::frontend
        Sidebar["Sidebar"]:::frontend
        CanvasArea["CanvasArea"]:::frontend
        TopBar["TopBar"]:::frontend
        BottomBar["BottomBar"]:::frontend
        MainMenu["MainMenu"]:::frontend
    end

    %% Feature Components
    subgraph "Feature Components"
        subgraph "Automaton Editor"
            EditorView["EditorView"]:::frontend
            AlphabetEditor["AlphabetEditor"]:::frontend
            TransitionTable["TransitionTable"]:::frontend
        end
        subgraph "Automaton Simulator"
            SimulatorView["SimulatorView"]:::frontend
            SimulatorPanel["SimulatorPanel"]:::frontend
            AutomatonCanvas_C["AutomatonCanvas"]:::frontend
        end
        subgraph "Tutorial Module"
            Tutorial["Tutorial"]:::frontend
            TutorialView["TutorialView"]:::frontend
        end
    end

    %% State Management
    Store[(Redux Store)]:::stateMgmt
    subgraph "Redux Slices"
        AutomatonSlice["automatonSlice"]:::stateMgmt
        CanvasSlice["canvasSlice"]:::stateMgmt
        TutorialSlice["tutorialSlice"]:::stateMgmt
        UISlice["uiSlice"]:::stateMgmt
    end

    %% Persistence Layer
    PersistenceDB[(LocalStorage/FileAPI)]:::persistence
    PersistenceComp["AutomatonPersistence"]:::frontend

    %% Styling Engine
    subgraph "Styling Engine"
        Tailwind["tailwind.config.js"]:::styling
        PostCSS["postcss.config.js"]:::styling
        GlobalCSS["src/assets/index.css"]:::styling
        CanvasCSS1["src/assets/canvas.css"]:::styling
        CanvasCSS2["src/styles/canvas.css"]:::styling
    end

    %% Build & Dev Server
    subgraph "Build & Dev Server"
        Vite["vite.config.js"]:::build
        PackageJSON["package.json"]:::build
    end

    %% Connections
    Browser -->|"loads"| IndexHTML
    IndexHTML --> MainJSX
    MainJSX --> AppJSX
    AppJSX --> Header
    AppJSX --> Sidebar
    AppJSX --> CanvasArea
    AppJSX --> TopBar
    AppJSX --> BottomBar
    AppJSX --> MainMenu
    AppJSX --> EditorView
    AppJSX --> SimulatorView
    AppJSX --> Tutorial
    Header -->|contains| MainMenu
    Sidebar -->|hosts| AutomatonEditor
    CanvasArea -->|renders| AutomatonCanvas_C
    TopBar -->|controls| EditorView
    BottomBar -->|controls| SimulatorPanel

    %% Data Flow
    Header -->|"dispatch Action"| Store
    Sidebar -->|"dispatch Action"| Store
    EditorView -->|"dispatch Action"| Store
    SimulatorPanel -->|"dispatch Action"| Store
    Store -->|"state update"| Header
    Store -->|"state update"| Sidebar
    Store -->|"state update"| EditorView
    Store -->|"state update"| SimulatorView

    Store --> PersistenceComp
    PersistenceComp --> PersistenceDB

    Vite --> IndexHTML
    Vite --> MainJSX
    PackageJSON --> Vite

    Tailwind --> GlobalCSS
    Tailwind --> CanvasCSS1
    Tailwind --> CanvasCSS2
    PostCSS --> GlobalCSS
    PostCSS --> CanvasCSS2
    GlobalCSS --> IndexHTML
    CanvasCSS1 --> CanvasArea
    CanvasCSS2 --> CanvasArea

    %% Redux slices connections
    Store --> AutomatonSlice
    Store --> CanvasSlice
    Store --> TutorialSlice
    Store --> UISlice

    %% Click Events
    click IndexHTML "https://github.com/krydelmany/nano-flap/blob/main/index.html"
    click MainJSX "https://github.com/krydelmany/nano-flap/blob/main/src/main.jsx"
    click AppJSX "https://github.com/krydelmany/nano-flap/blob/main/src/App.jsx"
    click Header "https://github.com/krydelmany/nano-flap/blob/main/src/components/layout/Header.jsx"
    click Sidebar "https://github.com/krydelmany/nano-flap/blob/main/src/components/layout/Sidebar.jsx"
    click CanvasArea "https://github.com/krydelmany/nano-flap/blob/main/src/components/layout/CanvasArea.jsx"
    click TopBar "https://github.com/krydelmany/nano-flap/blob/main/src/components/layout/TopBar.jsx"
    click BottomBar "https://github.com/krydelmany/nano-flap/blob/main/src/components/layout/BottomBar.jsx"
    click MainMenu "https://github.com/krydelmany/nano-flap/blob/main/src/components/layout/MainMenu.jsx"
    click EditorView "https://github.com/krydelmany/nano-flap/blob/main/src/components/automaton/EditorView.jsx"
    click AlphabetEditor "https://github.com/krydelmany/nano-flap/blob/main/src/components/automaton/AlphabetEditor.jsx"
    click TransitionTable "https://github.com/krydelmany/nano-flap/blob/main/src/components/automaton/TransitionTable.jsx"
    click SimulatorView "https://github.com/krydelmany/nano-flap/blob/main/src/components/automaton/SimulatorView.jsx"
    click SimulatorPanel "https://github.com/krydelmany/nano-flap/blob/main/src/components/SimulatorPanel.jsx"
    click AutomatonCanvas_C "https://github.com/krydelmany/nano-flap/blob/main/src/components/AutomatonCanvas.jsx"
    click Tutorial "https://github.com/krydelmany/nano-flap/blob/main/src/components/tutorial/Tutorial.jsx"
    click TutorialView "https://github.com/krydelmany/nano-flap/blob/main/src/components/tutorial/TutorialView.jsx"
    click PersistenceComp "https://github.com/krydelmany/nano-flap/blob/main/src/components/automaton/AutomatonPersistence.jsx"
    click AutomatonSlice "https://github.com/krydelmany/nano-flap/blob/main/src/models/automatonSlice.js"
    click CanvasSlice "https://github.com/krydelmany/nano-flap/blob/main/src/models/canvasSlice.js"
    click TutorialSlice "https://github.com/krydelmany/nano-flap/blob/main/src/models/tutorialSlice.js"
    click UISlice "https://github.com/krydelmany/nano-flap/blob/main/src/models/uiSlice.js"
    click Store "https://github.com/krydelmany/nano-flap/blob/main/src/store.js"
    click Tailwind "https://github.com/krydelmany/nano-flap/blob/main/tailwind.config.js"
    click PostCSS "https://github.com/krydelmany/nano-flap/blob/main/postcss.config.js"
    click GlobalCSS "https://github.com/krydelmany/nano-flap/blob/main/src/assets/index.css"
    click CanvasCSS1 "https://github.com/krydelmany/nano-flap/blob/main/src/assets/canvas.css"
    click CanvasCSS2 "https://github.com/krydelmany/nano-flap/blob/main/src/styles/canvas.css"
    click Vite "https://github.com/krydelmany/nano-flap/blob/main/vite.config.js"
    click PackageJSON "https://github.com/krydelmany/nano-flap/blob/main/package.json"

    %% Styles
    classDef frontend fill:#cceeff,stroke:#333,stroke-width:1px
    classDef stateMgmt fill:#ccffcc,stroke:#333,stroke-width:1px
    classDef persistence fill:#ffffcc,stroke:#333,stroke-width:1px
    classDef build fill:#e0e0e0,stroke:#333,stroke-width:1px
    classDef styling fill:#eeccee,stroke:#333,stroke-width:1px
    classDef external fill:#ffdddd,stroke:#333,stroke-width:1px
