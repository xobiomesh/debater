document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

    let selectedCharacter1 = null;
    let selectedCharacter2 = null;
    let conversation = [];

    fetch('/character_profiles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Character profiles loaded:", data);
            const characterIcons1 = document.getElementById('characterIcons1');
            const characterIcons2 = document.getElementById('characterIcons2');

            data.forEach((character, index) => {
                const icon1 = document.createElement('img');
                const icon2 = document.createElement('img');
                const characterName = character["Character Name"].toLowerCase().replace(/ /g, '_');
                
                icon1.src = `images/${characterName}.png`;
                icon1.alt = character["Character Name"];
                icon1.className = 'character-icon';
                icon1.dataset.index = index;
                
                icon2.src = `images/${characterName}.png`;
                icon2.alt = character["Character Name"];
                icon2.className = 'character-icon';
                icon2.dataset.index = index;
                
                icon1.addEventListener('click', function() {
                    console.log(`Character 1 selected: ${character["Character Name"]}`);
                    selectedCharacter1 = character;
                    document.getElementById('characterIcons1').querySelectorAll('.character-icon').forEach(icon => icon.classList.remove('selected'));
                    icon1.classList.add('selected');
                    document.getElementById('nextResponse1').textContent = `Response from ${character["Character Name"]}`;
                });
                
                icon2.addEventListener('click', function() {
                    console.log(`Character 2 selected: ${character["Character Name"]}`);
                    selectedCharacter2 = character;
                    document.getElementById('characterIcons2').querySelectorAll('.character-icon').forEach(icon => icon.classList.remove('selected'));
                    icon2.classList.add('selected');
                    document.getElementById('nextResponse2').textContent = `Response from ${character["Character Name"]}`;
                });

                characterIcons1.appendChild(icon1);
                characterIcons2.appendChild(icon2);
            });
        })
        .catch(error => {
            console.error('Error fetching character profiles:', error);
        });

    window.startDebate = function() {
        console.log("startDebate function called");

        const debateTopic = document.getElementById('debateInput').value;
        const messages = document.getElementById('messages');

        if (!debateTopic.trim() || !selectedCharacter1 || !selectedCharacter2) {
            console.warn("Debate topic or characters not selected");
            return;
        }

        // Clear previous messages
        messages.innerHTML = '';
        conversation = [`Debate Topic: ${debateTopic}`];

        // Indicate that the debate has started
        fetch('/api/startDebate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic: debateTopic
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const startMessage = document.createElement('div');
            startMessage.textContent = `Debate started. Topic: ${debateTopic}. You can now request responses from the characters.`;
            startMessage.classList.add('message');
            messages.appendChild(startMessage);
        })
        .catch(error => {
            console.error('Error starting debate:', error);
        });
    };

    window.getNextResponse = function(characterNumber) {
        console.log(`getNextResponse function called for character ${characterNumber}`);

        if (!conversation.length || !selectedCharacter1 || !selectedCharacter2) {
            console.warn("No conversation or characters not selected");
            return;
        }

        const character = characterNumber === 1 ? selectedCharacter1["Character Name"] : selectedCharacter2["Character Name"];
        const conversationHistory = conversation.join('\n');
        const language = document.getElementById('language').value;  // Get selected language

        fetch('/api/getResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                character: character,
                conversation: conversationHistory,
                language: language  // Include language in the request payload
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const debateMessage = document.createElement('div');
            debateMessage.classList.add('message');
            if (data.character === selectedCharacter1["Character Name"]) {
                debateMessage.classList.add('character1');
            } else {
                debateMessage.classList.add('character2');
            }

            const characterName = document.createElement('div');
            characterName.textContent = data.character;
            characterName.classList.add('character-name');

            const messageText = document.createElement('div');
            messageText.textContent = data.text;
            messageText.classList.add('message-text');

            debateMessage.appendChild(characterName);
            debateMessage.appendChild(messageText);

            document.getElementById('messages').appendChild(debateMessage);

            // Update conversation history
            conversation.push(`${data.character}: ${data.text}`);

            // Scroll to the bottom
            document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
        })
        .catch(error => {
            console.error('Error getting next response:', error);
        });
    };
});
