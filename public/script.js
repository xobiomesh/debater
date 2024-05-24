document.addEventListener("DOMContentLoaded", function() {
    let selectedCharacter1 = null;
    let selectedCharacter2 = null;

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
                });
                
                icon2.addEventListener('click', function() {
                    selectedCharacter2 = character;
                    document.getElementById('characterIcons2').querySelectorAll('.character-icon').forEach(icon => icon.classList.remove('selected'));
                    icon2.classList.add('selected');
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

        // Send debate topic and selected characters to backend
        fetch('/api/startDebate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic: debateTopic,
                character1: selectedCharacter1["Character Name"],
                character2: selectedCharacter2["Character Name"]
            })
        })
        .then(response => response.json())
        .then(data => {
            let delay = 0;
            const delayIncrement = 2000; // 2 seconds delay between messages

            data.debate.forEach((message, index) => {
                delay += delayIncrement;
                setTimeout(() => {
                    const debateMessage = document.createElement('div');
                    debateMessage.textContent = `${message.character}: ${message.text}`;
                    debateMessage.classList.add('message');
                    if (index % 2 === 0) {
                        debateMessage.classList.add('character1');
                    } else {
                        debateMessage.classList.add('character2');
                    }
                    messages.appendChild(debateMessage);

                    // Scroll to the bottom
                    messages.scrollTop = messages.scrollHeight;
                }, delay);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
