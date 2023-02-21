//Lógica dos dados
import { GithubUser } from "./GithubUser.js"
export class Favorites {
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    verifyIfThereAreUser(){
        const tableFull= document.querySelector('.table-wrapper-fav')
        const tableEmpty= document.querySelector('.table-wrapper-no-fav')

        if(this.entries.length == 0){
            tableFull.classList.add('hidden')
            tableEmpty.classList.remove('hidden')

        }else{
            console.log('Há user!')
            tableFull.classList.remove('hidden')
            tableEmpty.classList.add ('hidden')
        }
    }

    async add(username){
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists){
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)

            if (user.login === undefined){
                throw new Error('Usuário não encontrado!')
            }
            this.entries = [user, ...this.entries]
            this.update()
            this.verifyIfThereAreUser();
            this.save()

        } catch(error){
            alert(error.message)
        }
    }

    delete(user){
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.verifyIfThereAreUser();
        this.save()
    }

}

//Funçoes de mostragem dos dados
export class FavoritesView extends Favorites{
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.verifyIfThereAreUser();
        this.onAdd()
    }

    onAdd(){

        const addButton = this.root.querySelector('#send_search')

        addButton.onclick = ()=> {
            const {value} = this.root.querySelector('#input_username')
            this.add(value)
        }

    }


    update(){

        this.removeAllTr()
        
        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user a p').textContent = user.name
            row.querySelector('.user span').textContent = `/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            this.tbody.append(row)

            row.querySelector('.remover').onclick = ()=>{
                const isOk = confirm("Tem certeza que deseja deletar esta linha?")
                if(isOk){
                    this.delete(user)
                    this.verifyIfThereAreUser();
                }
            }
        })
    }




//Criar um a tag tr por 
    createRow(){
        const tr = document.createElement('tr')

        const content = 
        `
            <td class="user">
                <img src="null" alt="imagem de ">
                <a href="null" target="_blank">
                    <p>NULL</p>
                    <span>/NULL</span>
                </a>
            </td>
            <td class="repositories">
                123
            </td>
            <td class="followers">
                1234
            </td>
            <td class="remover">
                <button class="remove">Remover</button>
            </td>
        `

        tr.innerHTML = content

        return tr
    }


    removeAllTr(){
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        });
    }

    
}