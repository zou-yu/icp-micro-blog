import { micro_blog_backend, createActor } from '../../declarations/micro_blog_backend'


const postButton = document.getElementById('post')


async function post() {
    postButton.disabled = true
    const textarea = document.getElementById('message')
    const text = textarea.value
    const otp = document.getElementById('otp').value
    await micro_blog_backend.post(otp, text)
    postButton.disabled = false
}

async function loadPosts() {
    const postSection = document.getElementById('posts')
    const posts = await micro_blog_backend.posts(0)
    postSection.replaceChildren([])
    posts.forEach((post) => {
        const postElement = document.createElement('p')
        postElement.innerHTML = `${post.text}
        <br/>
        by ${post.author}
        <br/>
        at ${new Date(new Number(post.time / 1000000n))}
        <hr/>`
        postSection.appendChild(postElement)
    })
}

async function loadTimeline() {
    const timelineSection = document.getElementById('timeline')
    const posts = await micro_blog_backend.timeline(0)
    timelineSection.replaceChildren([])
    posts.forEach((post) => {
        const postElement = document.createElement('p')
        postElement.innerHTML = `${post.text}
        <br/>
        by ${post.author}
        <br/>
        at ${new Date(new Number(post.time / 1000000n))}
        <hr/>`
        timelineSection.appendChild(postElement)
    })
}

async function handleShowPosts(canisterId) {
    const followCanister = createActor(canisterId)
    const posts = await followCanister.posts(0)
    posts.forEach((post) => {
        const postElement = document.getElementById(canisterId)
        const posts = document.createElement('div')
        postElement.appendChild(posts)
        posts.innerHTML = `${post.text}
        <br/>
        by ${post.author}
        <br/>
        at ${new Date(new Number(post.time / 1000000n))}
        <hr/>`
    })
    
}


async function loadFollows() {
    const followsSection = document.getElementById('follows')
    const follows = await micro_blog_backend.follows()
    console.log(follows)
    followsSection.replaceChildren([])
    for (let follow of follows) {
        const canisterId = follow.toString()
        const followCanister = createActor(canisterId)
        const name = await followCanister.get_name()
        const div = document.createElement('div')
        div.id = canisterId
        const p = document.createElement('p')
        const button = document.createElement('button')
        p.innerHTML = name
        button.onclick = () => {
            button.disabled = true
            handleShowPosts(canisterId)
        }
        button.innerText = 'show posts'
        p.appendChild(button)
        div.appendChild(p)
        followsSection.appendChild(div)
    }
    
}



function load() {
    postButton.onclick = post
    setInterval(loadPosts, 3000)
    loadTimeline()
    loadFollows()
}

window.onload = load
