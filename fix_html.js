const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The file currently goes from </head> directly to <!-- LEFT COLUMN: Scrollable Job List -->
// We need to inject the body, nav, hero, and top filters between them.

const replacement = `</head>
<body class="bg-gray-50 text-gray-800 antialiased min-h-screen flex flex-col">

    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <i class="fas fa-briefcase text-white text-sm"></i>
                    </div>
                    <img src="zimbabwe-work-thumbnail.jpg" alt="ZimWork ZW Logo" class="h-8 w-8 rounded mr-2 object-cover shadow-sm">
                    <span class="font-bold text-xl tracking-tight"><span class="text-primary">Zim</span><span class="text-accent">Work</span></span>
                </div>
                <div class="flex items-center space-x-4">
                    <button class="hidden md:block text-gray-500 hover:text-primary font-medium transition-colors">For Employers (ATS)</button>
                    <button class="text-gray-500 hover:text-primary font-medium transition-colors">Log in</button>
                    <button class="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                        One-Click Profile
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="bg-primary text-white py-12 px-4 relative overflow-hidden">
        <div class="max-w-7xl mx-auto text-center relative z-10">
            <h1 class="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Find Your Next Big Opportunity in Zimbabwe.</h1>
            <p class="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-normal leading-relaxed tracking-wide">The smart job board. High-quality jobs matching your exact skills.</p>
            
            <!-- Smart Search Bar -->
            <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-2 flex flex-col md:flex-row gap-2">
                <div class="flex-1 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                    <i class="fas fa-search text-gray-400 mr-3"></i>
                    <input type="text" id="searchInput" oninput="filterJobs()" placeholder="Job title, keywords, or company..." class="w-full bg-transparent py-3 text-gray-800 focus:outline-none">
                </div>
                <div class="flex-1 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                    <i class="fas fa-map-marker-alt text-gray-400 mr-3"></i>
                    <select id="locationFilter" onchange="filterJobs()" class="w-full bg-transparent py-3 text-gray-800 focus:outline-none appearance-none">
                        <option value="all">All Locations (Zim & Remote)</option>
                        <option value="Harare">Harare</option>
                        <option value="Bulawayo">Bulawayo</option>
                        <option value="Mutare">Mutare</option>
                        <option value="Remote">100% Remote</option>
                    </select>
                </div>
                <button onclick="filterJobs()" class="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-lg font-bold transition-colors w-full md:w-auto shadow-sm">
                    Search Jobs
                </button>
            </div>
        </div>
    </div>

    <!-- Main Content: Split Pane Layout -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <!-- Top Horizontal Categories/Filters -->
        <div class="flex flex-col mb-6 gap-3">
            <div class="flex justify-between items-center w-full">
                <h2 class="text-lg font-bold text-secondary">Browse by Industry</h2>
                <div class="shrink-0 text-sm font-semibold text-gray-500 bg-gray-100 px-4 py-1.5 rounded-lg border border-gray-200 shadow-sm" id="jobCount">
                    Loading...
                </div>
            </div>
            <div id="categoryContainer" class="flex overflow-x-auto hide-scrollbar gap-2 pb-2 w-full">
                <!-- Javascript will populate this -->
            </div>
        </div>

        <!-- Demarcation: Left (List) and Right (Profile View) -->
        <div class="flex flex-col lg:flex-row gap-6 items-start">
            
            <!-- LEFT COLUMN: Scrollable Job List -->`;

html = html.replace(/<\/head>[\s\S]*?<!-- LEFT COLUMN: Scrollable Job List -->/, replacement);

// We must also ensure `</body></html>` exists at the end of the file since our replace removed the <body> tag but the end tags should still be there. Wait, the end tags are there.

fs.writeFileSync('index.html', html);
console.log("Restored index.html Layout!");
