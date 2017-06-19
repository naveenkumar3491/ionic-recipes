import firebase from 'firebase';
export class AuthService{
    signUp(email: string, password: string){
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    signIn(email: string, password: string){
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    logout(){
        firebase.auth().signOut();
        //it will delete out token
    }

    getCurrentUser(){
        return firebase.auth().currentUser;
    }
}