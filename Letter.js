var noteOpen = false;
var OpenedWithPassword = false;
var currentYear = '';

// Letter content for each year
const letters = {
    '2023': {
        date: 'December 28, 2023',
        content: `<div class="paragraph">Dear Julie,</div>
        <div class="paragraph">I'm going to be honest with you; I was searching up trivia questions, and I found this one question that really got me thinking: "When did you know you loved your partner?" I was stumped for about a day because I didn't have a straightforward answer. Then, I remembered this theory called the "Three Loves Theory" or the "Three Types of Love Theory." It suggests we go through three different love experiences or fall for three people in our lives, each time for a specific reason.</div>
        <div class="paragraph">The first love hits when we're young, maybe in high school. It's the idealistic love seen in movies or read in books—what we think we should be doing to fit in. We get into it, thinking it's the only love we'll ever have, even if it doesn't feel quite right. We may suppress our honest feelings to sustain the relationship, all because we believe this is what love is supposed to be. It's all about how others see us, not how we really feel. The first love is all about the picture.</div>
        <div class="paragraph">Second love? That's our hard love. It teaches us lessons about who we are and how we want to be loved. It's the kind that hurts, filled with lies, pain, and maybe some manipulation. We think we're making different choices than the first time, but it turns out we're still trying to learn lessons, stuck in a cycle. This love can get pretty unhealthy. There might be drama, maybe even some emotional or physical stuff. This emotional roller coaster, with extreme highs and lows, keeps us hooked, hoping for a different outcome each time. Making it work becomes more important than our own well-being. The second love is the love we wish was easy and right.</div>
        <div class="paragraph">Third love? The third love is unexpected and enduring. It's the love that looks all wrong but somehow fits perfectly. No ideal expectations, no pressure to be someone else. You're just accepted for who you are. It's not what we pictured. But it shatters those preconceived notions and shows us love doesn't have to fit our or society's ideas to be real. The third love is the love that just feels right.</div>
        <div class="paragraph">So, when did I know I loved you? Honestly, I've fallen in love with you more than once. The first time, in 2014, was that youthful, lustful love. Then came the second type, hitting us from 2015 to 2021—we weathered storms. We kept falling for each other during this time as we kept rediscovering love in a long-term relationship, making mistakes, overcoming challenges together, hanging on, and growing.</div>
        <div class="paragraph">In 2021, our love story reached its climax. It was the final lesson that paved the way for the third type of love—the one that feels like home without any explanation. Unconditional love, selfless and deep. It goes beyond personal desires, focusing on acceptance, compassion, and unconditional support.</div>
        <div class="paragraph">Since then, I've been fortunate to experience this third type of love with you multiple times, and I consider myself damn lucky; especially to have shared all three types of love with you. You're beautiful, smart, and fun—a perfect storm that I had the chance to weather. Your patience and support allowed me to learn and grow, and for that, I am endlessly grateful. As we celebrate our 10-year anniversary, I look forward to continuing this journey with you—learning more about you, myself, and the ever-evolving nature of love.</div>
        <div class="finalMessage"><a id="openVideo">Here's to 10 amazing years, my love.</a></div>
        <div class="paragraph">Sincerely,<br>Len-Nerd</div>`
    },
    '2024': {
        date: 'December 28, 2024',
        content: `<div class="paragraph">Happy 11th Anniversary, baby girl!</div>
        <div class="paragraph">You know I love you, and I'll always love you the same, every single day. You're always going to be special to me, and I promise to treat you right and spoil you however I can. Making you happy and seeing you smile is my top priority.</div>
        <div class="paragraph">I know I've messed up in the past, and even sometimes recently, but I promise I'm working to be better for you. I'm yours, and I've made up my mind about that. I don't care about arguments or tough times because I'd rather go through them with you than be with anyone else. I can't picture my life without you, because you're not just my girlfriend, you're my best friend.</div>
        <div class="paragraph">I'm so thankful you've stuck around even when I wasn't at my best. You're the one I want to spend the rest of my life with. I want to give you the world, and I'm working hard to make that happen. I plan to marry you, Julie. It would make me the happiest person in the world.</div>
        <div class="paragraph">You deserve everything I've done for you, and honestly, so much more. I love you, always have, always will.</div>
        <div class="paragraph">Love,<br>Len-Nerd</div>`
    },
    '2025': {
        date: 'December 28, 2025',
        content: `<div class="paragraph">Julie,</div>
    <div class="paragraph">I've been thinking a lot about everything. Not just what has happened, but the years behind it. I know words alone don't fix what I messed up, and I'm not trying to talk my way out of anything. I just finally understand what you were asking from me, and I don't want to avoid that anymore.</div>
    <div class="paragraph">For a long time, I thought loving you deeply was enough. I felt it, I meant it, I carried it with me. But I see now that love without action just hurts, and I know that hurt landed on you. You waited, you asked, you trusted me with your time and your heart, and I didn't show up the way I should have. That's completely on me.</div>
    <div class="paragraph">I also want you to know that the things I'm doing now aren't out of panic or desperation. They're things I should've done a long time ago. I hate that it took getting this close to losing you for me to finally stop being afraid. Losing you has always been my biggest fear. I just didn't see that my fear of messing things up was what was actually holding me back from loving you the way you deserved.</div>
    <div class="paragraph">I'm not asking you to trust my words again. I'm asking you to look at what I'm actually doing. I'm handling a lot and I'm doing as much as I can at once, because I'm trying to build a life that can actually move forward. I'm planning, applying, and getting my shit together so moving to you is real and not just something I talk about.</div>
    <div class="paragraph">In a lot of moments this year, and honestly every past year with you, I've learned that things almost never go exactly as planned. Trips, visits, days, everything. We end up arguing sometimes, stressing out, struggling, but it's always been us together. We talk, one of us steps up when the other can't handle it, or we figure it out together, and in the end we make it work. We always do. That's what I love about us. Even when it's hard, we're still a team. Whether it's in a game or in real life, we've always been on the same side, and that's what matters most to me.</div>
    <div class="paragraph">While I'm doing the work on my end, I don't want you to feel like your life has to be on pause for me. I want you to live, to enjoy time with your family, to go out with your mom, to do things that make you happy and bring you peace. I want you to be smart and take care of yourself, but I never want to be the reason you stop living your life. Loving you also means wanting you happy, present, and okay, even while I'm working to catch up.</div>
    <div class="paragraph">I also want to thank you for sticking by me no matter what, for loving me even when I didn't fully believe I could be loved. You brought out a new side of me, made me more confident, happier, and more open than I ever thought I could be. I wouldn't be who I am today without you, and I feel like I owe you so much. I want to give you all the love, care, and effort you deserve, every single day.</div>
    <div class="paragraph">So I want to be honest with you.
I want to be your boyfriend again.
Not in a vague way. Not in a someday way.
I want to be yours and have you be mine while I keep doing the work to close the distance for real.</div>
    <div class="paragraph">I'm not asking you to forget the past or ignore how scared you feel. I understand why you feel that way. I would too. I just want the chance to show you consistency, not just say the right things once. I want the chance to choose you every day and let my actions finally match what I've always felt.</div>
    <div class="paragraph">If your answer is no, I'll respect that. I really will. But if there's still a part of you that wants to see if we can do this the right way, I'm here. And I'm ready to work with you, not rush you or pressure you.</div>
    <div class="paragraph">I love you, Julie.</div>
    <div class="paragraph">Always,<br>Lenny</div>`
    }
};

function openSelectedLetter() {
    const dropdown = document.getElementById('yearDropdown');
    const year = dropdown.value;

    if (!year) {
        alert('Please select a year first!');
        return;
    }

    selectLetter(year);
}

function selectLetter(year) {
    currentYear = year;
    const letter = letters[year];

    // Update letter content
    document.getElementById('letterYear').textContent = `♡ ${letter.date} ♡`;
    document.getElementById('letterContent').innerHTML = letter.content;

    // Fade out the title
    const title = document.querySelector('h1');
    title.classList.add('fade-out');

    // Add hiding animation to selection screen
    const selectionScreen = document.getElementById('letterSelection');
    selectionScreen.classList.add('hiding');

    // Wait for fade out animation, then show letter
    setTimeout(() => {
        selectionScreen.style.display = 'none';
        selectionScreen.classList.remove('hiding');

        const letterContainer = document.getElementById('letterContainer');
        letterContainer.style.display = 'flex';
        letterContainer.classList.add('showing');

        // Remove the showing class after animation completes
        setTimeout(() => {
            letterContainer.classList.remove('showing');
        }, 800);
    }, 500);

    // Reset note state
    noteOpen = false;
    OpenedWithPassword = false;

    const note = document.getElementById('note');
    const message = document.getElementById('message');
    note.style.width = '300px';
    note.style.height = '170px';
    note.style.backgroundImage = 'url("./assets/Envelope.png")';
    note.style.overflow = 'hidden';
    message.style.visibility = 'hidden';
}

function backToSelection() {
    const letterContainer = document.getElementById('letterContainer');
    letterContainer.style.display = 'none';

    const selectionScreen = document.getElementById('letterSelection');
    selectionScreen.style.display = 'flex';

    // Fade the title back in
    const title = document.querySelector('h1');
    title.classList.remove('fade-out');

    // Reset dropdown
    document.getElementById('yearDropdown').value = '';

    // Reset note state
    noteOpen = false;
    OpenedWithPassword = false;

    const note = document.getElementById('note');
    const message = document.getElementById('message');
    note.style.width = '300px';
    note.style.height = '170px';
    note.style.backgroundImage = 'url("./assets/Envelope.png")';
    note.style.overflow = 'hidden';
    message.style.visibility = 'hidden';
}

async function openNote() {
    if (noteOpen) return;

    var passed = false;
    var result = await checkNoteCode();

    if (result === null) {
        alert('Password entry canceled. Cannot view the note.');
        return;
    }
    passed = result;

    if (passed) {
        noteOpen = true;

        var note = document.getElementById('note');
        var message = document.getElementById('message');

        note.style.width = '650px';
        note.style.height = 'auto';
        note.style.backgroundImage = 'url("./assets/Paper.jpg")';
        note.style.overflow = 'auto';
        message.style.visibility = 'visible';

        // Re-attach video click handler if 2023 letter
        if (currentYear === '2023') {
            const videoLink = document.getElementById('openVideo');
            if (videoLink) {
                videoLink.addEventListener('click', function (event) {
                    event.preventDefault();

                    // Pause the music from MusicPlayer.js
                    if (typeof pauseAudio === 'function') {
                        pauseAudio();
                    }

                    var videoUrl = './video/Happy10Years.mp4';
                    var modal = document.createElement('div');
                    modal.className = 'video-modal';

                    var videoElement = document.createElement('video');
                    videoElement.src = videoUrl;
                    videoElement.controls = true;
                    videoElement.autoplay = true;

                    modal.appendChild(videoElement);
                    document.body.appendChild(modal);

                    videoElement.addEventListener('ended', function () {
                        // Resume the music from MusicPlayer.js
                        if (typeof resumeAudio === 'function') {
                            resumeAudio();
                        }
                        document.body.removeChild(modal);
                    });

                    modal.addEventListener('click', function (event) {
                        if (event.target === modal) {
                            // Resume the music from MusicPlayer.js
                            if (typeof resumeAudio === 'function') {
                                resumeAudio();
                            }
                            document.body.removeChild(modal);
                        }
                    });
                });
            }
        }
    } else {
        alert('Must enter the correct password to view note.');
    }
}