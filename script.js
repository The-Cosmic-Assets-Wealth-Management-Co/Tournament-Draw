let potsArray = [];
let availablePositions = [];
let currentPotIndex = 0;
let selectedTeam = null;
let availableTeamsInCurrentPot = [];

document.getElementById('teamCount').addEventListener('input', createTeamInputs);

// Dynamically generate input fields for team names
function createTeamInputs() {
    const teamCount = document.getElementById('teamCount').value;
    const teamsContainer = document.getElementById('teamsContainer');
    teamsContainer.innerHTML = '';
    for (let i = 0; i < teamCount; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Team ${i + 1} Name`;
        input.className = 'team-input';
        teamsContainer.appendChild(input);
    }
}

document.getElementById('drawForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const teamInputs = document.querySelectorAll('.team-input');
    const teams = Array.from(teamInputs).map(input => input.value);
    const teamCount = parseInt(document.getElementById('teamCount').value);
    const potsCount = Math.sqrt(teamCount);

    if (teamCount % potsCount !== 0) {
        alert('The number of teams must allow even division into pots.');
        return;
    }

    // Create pots and display them
    potsArray = assignTeamsToPots(teams, potsCount);
    availablePositions = generatePositions(teamCount);
    displayPots();
    
    document.getElementById('pickTeamButton').disabled = false;
    currentPotIndex = 0;
    availableTeamsInCurrentPot = [...potsArray[currentPotIndex]];
});

function assignTeamsToPots(teams, potCount) {
    const potsArray = [];
    for (let i = 0; i < potCount; i++) {
        potsArray[i] = [];
    }

    let currentPotIndex = 0;
    while (teams.length > 0) {
        const randomIndex = Math.floor(Math.random() * teams.length);
        const team = teams.splice(randomIndex, 1)[0];
        potsArray[currentPotIndex].push(team);
        currentPotIndex = (currentPotIndex + 1) % potCount;
    }

    return potsArray;
}

function generatePositions(teamCount) {
    const positionsArray = [];
    for (let i = 1; i <= teamCount; i++) {
        positionsArray.push(i);
    }
    return positionsArray;
}

// Display pots
function displayPots() {
    const potsSection = document.getElementById('potsSection');
    potsSection.innerHTML = '';
    potsArray.forEach((pot, index) => {
        const potDiv = document.createElement('div');
        potDiv.classList.add('pot');
        potDiv.innerHTML = `<h3>Pot ${index + 1}</h3><ul>${pot.map(team => `<li>${team}</li>`).join('')}</ul>`;
        potsSection.appendChild(potDiv);
    });
}

// Button to pick a team
document.getElementById('pickTeamButton').addEventListener('click', function() {
    if (availableTeamsInCurrentPot.length === 0) {
        currentPotIndex++;
        if (currentPotIndex >= potsArray.length) {
            alert('All teams have been drawn!');
            document.getElementById('pickTeamButton').disabled = true;
            document.getElementById('pickPositionButton').disabled = true;
            return;
        }
        availableTeamsInCurrentPot = [...potsArray[currentPotIndex]];
    }

    const randomTeamIndex = Math.floor(Math.random() * availableTeamsInCurrentPot.length);
    selectedTeam = availableTeamsInCurrentPot.splice(randomTeamIndex, 1)[0];
    alert(`Team drawn: ${selectedTeam}`);

    document.getElementById('pickPositionButton').disabled = false;
});

// Button to pick a position
document.getElementById('pickPositionButton').addEventListener('click', function() {
    if (!selectedTeam) {
        alert('Pick a team first!');
        return;
    }

    const randomPositionIndex = Math.floor(Math.random() * availablePositions.length);
    const assignedPosition = availablePositions.splice(randomPositionIndex, 1)[0];
    
    addToRecordTable(selectedTeam, assignedPosition);
    
    selectedTeam = null;
    document.getElementById('pickPositionButton').disabled = true;
});

// Add drawn team and position to the record table
function addToRecordTable(team, position) {
    const tableBody = document.querySelector('#drawRecordTable tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `<td>${team}</td><td>${position}</td>`;
    tableBody.appendChild(newRow);

    document.getElementById('sortTableButton').disabled = false;
}

// Button to sort the table by position
document.getElementById('sortTableButton').addEventListener('click', function() {
    const tableBody = document.querySelector('#drawRecordTable tbody');
    const rows = Array.from(tableBody.rows);

    rows.sort((a, b) => {
        const posA = parseInt(a.cells[1].innerText);
        const posB = parseInt(b.cells[1].innerText);
        return posA - posB;
    });

    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
});
