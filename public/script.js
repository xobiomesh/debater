document.addEventListener("DOMContentLoaded", function() {
    let selectedCharacter1 = null;
    let selectedCharacter2 = null;
    let conversation = [];

    fetch('./character_profiles.json')
        .then(response => response.json())
        .then(data => {
            const characterIcons1 = document.getElementById('characterIcons1');
            const characterIcons2 = document.getElementById('characterIcons2');

            data.forEach((character, index) => {
                const icon1 = document.createElement('img');
                const icon2 = document.createElement('img');
                const characterName = character["Character Name"].toLowerCase().replace(' ', '_');
                
                icon1.src = `images/${characterName}.png`;
                icon1.alt = character["Character Name"];
                icon1.className = 'character-icon';
                icon1.dataset.index = index;
                
                icon2.src = `images/${characterName}.png`;
                icon2.alt = character["Character Name"];
                icon2.className = 'character-icon';
                icon2.dataset.index = index;
                
                icon1.addEventListener('click', function() {
                    selectedCharacter1 = character;
                    document.getElementById('characterIcons1').querySelectorAll('.character-icon').forEach(icon => icon.classList.remove('selected'));
                    icon1.classList.add('selected');
                    document.getElementById('nextResponse1').textContent = `Get Next Response from ${character["Character Name"]}`;
                });
                
                icon2.addEventListener('click', function() {
                    selectedCharacter2 = character;
                    document.getElementById('characterIcons2').querySelectorAll('.character-icon').forEach(icon => icon.classList.remove('selected'));
                    icon2.classList.add('selected');
                    document.getElementById('nextResponse2').textContent = `Get Next Response from ${character["Character Name"]}`;
                });

                characterIcons1.appendChild(icon1);
                characterIcons2.appendChild(icon2);
            });
        });

    window.startDebate = function() {
        const debateTopic = document.getElementById('debateInput').value;
        const messages = document.getElementById('messages');

        if (!debateTopic.trim() || !selectedCharacter1 || !selectedCharacter2) {
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
        .then(response => response.json())
        .then(data => {
            const startMessage = document.createElement('div');
            startMessage.textContent = 'Debate started. You can now request responses from the characters.';
            startMessage.classList.add('message');
            messages.appendChild(startMessage);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    window.getNextResponse = function(characterNumber) {
        if (!conversation.length || !selectedCharacter1 || !selectedCharacter2) {
            return;
        }

        const character = characterNumber === 1 ? selectedCharacter1["Character Name"] : selectedCharacter2["Character Name"];
        const conversationHistory = conversation.join('\n');

        fetch('/api/getResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                character: character,
                conversation: conversationHistory
            })
        })
        .then(response => response.json())
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
            console.error('Error:', error);
        });
    }
});
