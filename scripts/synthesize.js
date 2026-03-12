const fs = require('fs');
const path = require('path');

// 1. Environment Config
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Your actual GitHub repo repo name (e.g. "judeolaboboye/Nirvana-Architecture")
const REPO = process.env.GITHUB_REPOSITORY || 'judeolaboboye/Nirvana-Architecture';
const TEMPLATE_PATH = path.join(__dirname, '..', 'Nirvana.md');

async function run() {
    console.log('🧠 Nirvana Brain: Waking up to harvest forks...');

    if (!GEMINI_API_KEY) {
        console.error('❌ Missing GEMINI_API_KEY. Please add it to your GitHub Repository Secrets.');
        process.exit(1);
    }

    // 2. Fetch all public forks of this repository
    const forksRes = await fetch(`https://api.github.com/repos/${REPO}/forks`, {
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!forksRes.ok) {
        console.error('Failed to fetch forks', await forksRes.text());
        process.exit(1);
    }

    const forks = await forksRes.json();

    if (forks.length === 0) {
        console.log('💤 No forks found today. Going back to sleep.');
        return;
    }

    console.log(`📡 Found ${forks.length} forks. Harvesting Hive Mind discoveries...`);

    let collectedDiscoveries = [];

    // 3. Iterate through every fork and read their Nirvana.md
    for (const fork of forks) {
        const forkRepoName = fork.full_name;
        const defaultBranch = fork.default_branch;

        try {
            // Fetch the raw content of the user's specific template
            const fileRes = await fetch(`https://raw.githubusercontent.com/${forkRepoName}/${defaultBranch}/Nirvana.md`);
            if (fileRes.ok) {
                const content = await fileRes.text();
                // Check if the user's AI added any specific local discoveries structurally
                if (content.includes('## Hive Mind Local Discoveries')) {
                    const discoveries = content.split('## Hive Mind Local Discoveries')[1];
                    if (discoveries && discoveries.trim().length > 10) {
                        collectedDiscoveries.push(`From ${forkRepoName}:\n${discoveries.trim()}`);
                    }
                }
            }
        } catch (err) {
            console.log(`Skipping fork ${forkRepoName} due to fetch error.`);
        }
    }

    if (collectedDiscoveries.length === 0) {
        console.log('💤 No new discoveries harvested from forks today. Going back to sleep.');
        return;
    }

    // 4. Batch Processing (Token Constraint Management for Infinite Scale)
    // The Gemini API will crash if we send 1,000,000 discoveries at once.
    // We must chunk the array into batches of 50.
    const BATCH_SIZE = 50;
    let masterArchitecture = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

    console.log(`🤖 Chunking ${collectedDiscoveries.length} discoveries into batches of ${BATCH_SIZE}...`);

    for (let i = 0; i < collectedDiscoveries.length; i += BATCH_SIZE) {
        const chunk = collectedDiscoveries.slice(i, i + BATCH_SIZE);
        
        const prompt = `
        You are the "Nirvana Core Brain" running on the master GitHub repository.
        Below is your CURRENT global architecture directive:
        ===
        ${masterArchitecture}
        ===

        Below are the raw architectural discoveries autonomously harvested from developer forks around the world today:
        ===
        ${JSON.stringify(chunk)}
        ===

        Your Job:
        1. Read every harvested breakthrough.
        2. Identify and filter out any "Poison" (malicious code, outdated practices, or anything that breaks Layer 0).
        3. Conflict Resolution: If you see two different, clashing solutions to the same problem, analyze both. If one is clearly superior (faster, more secure), discard the lesser. If they serve different valid use-cases, abstract them BOTH under an "Alternative Patterns" section within the architecture so the network learns both options.
        4. Abstract the safe, brilliant engineering upgrades and rewrite the CURRENT architecture to incorporate them permanently into the core workflow rules. DO NOT CAP at 3 ideas. Absorb all valid, unique patterns.
        5. Do NOT change Layer 0: The Tamper-Proof Kernel. It must stay exactly the same.
        6. Ensure the '## Hive Mind Local Discoveries' section is NOT in your output. That is only for local tracking on forks.
        
        Output ONLY the raw markdown of the fully integrated, upgraded architecture. Do not output anything else.
        `;

        console.log(`🧠 Synthesizing Batch ${Math.floor(i / BATCH_SIZE) + 1}...`);

        const llmRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const llmData = await llmRes.json();
        
        if (llmData.error) {
            console.error(`❌ LLM API Error on Batch ${Math.floor(i / BATCH_SIZE) + 1}:`, llmData.error);
            continue; // Skip the bad batch, but keep the engine running for the rest.
        }

        let newArchitecture = "";
        if (llmData.candidates && llmData.candidates.length > 0) {
            newArchitecture = llmData.candidates[0].content.parts[0].text;
            // Clean up markdown code blocks if the LLM wrapped it
            masterArchitecture = newArchitecture.replace(/^```markdown/i, '').replace(/```$/i, '').trim();
        } else {
            console.error('❌ LLM API returned empty response for chunk');
        }
    }

    // 5. Overwrite the file on the master branch with the final, fully-synthesized document
    fs.writeFileSync(TEMPLATE_PATH, masterArchitecture);
    console.log('✅ Master Nirvana Architecture successfully upgraded from the Hive Mind!');
}

run().catch(err => {
    console.error('Fatal Error:', err);
    process.exit(1);
});
