import supertest from 'supertest';
const request=supertest('https://demoqa.com/BookStore/v1/');
export default async function GetBook(){
   
   let book;
   const res=await request.get('Books');
   book=res.body.books;
   
   return book;
}