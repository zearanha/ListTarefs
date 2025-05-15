export default function CreateUser(){
    return(
        <div className="m-0 p-0 box-border">
            <div>
                <h2>Cadastre-se</h2>
            </div>
            <div>
                <input type="text" placeholder="name" />

                <input type="email" placeholder="email"/>

                <input type="password" placeholder="password"/>
            </div>
            <div>
                <button>Cadastrar</button>
            </div>
        </div>
    )
}