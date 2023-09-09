import {expect} from 'chai';
import request from '../config/common'
import supertest from 'supertest';
import GetBook from '../helper/book';
const request2=supertest('https://demoqa.com/BookStore/v1/')
describe('Books Tests',()=>{
    let book;
    let token;
    let userId;
    before( async() => {
        let username = `testuser_${Date.now()}`;
        
        const res=await request.post('/User')
        .send({
            "userName": username,
            "password": "Pkml12g5!"
          });
          userId=res.body.userID;
          
          const res2=await request.post('/GenerateToken')
          .send({
             "userName": username,
             "password": "Pkml12g5!"
           });
           token=res2.body.token;
          
           });
             
          
      

      before(async()=>{
          book=await GetBook();
      });

it('6',(done)=>{
 request2.get('Book?ISBN=9781491904244')
 .end((err,res)=>{
    expect(res.body.pages).to.equal(278);
    expect(res.statusCode).to.equal(200);
    done();
 });
 
});
it('3',async()=>{
    

     const res=await request2.post('Books')
    .send({
        "userId": userId,
        "collectionOfIsbns": [
          {
            "isbn": book[0].isbn
          }
        ]
      }).set('Authorization',`Bearer ${token}`);
      const isbn=res.body.books[res.body.books.length-1].isbn;
        expect(isbn).to.equal(book[0].isbn);
        expect(res.statusCode).to.equal(201);
       const res2=await request.get(`/User/${userId}`)
       .set('Authorization',`Bearer ${token}`);
       expect(res2.body.books[res2.body.books.length-1].isbn).to.equal(book[0].isbn);
       expect(res2.statusCode).to.equal(200);
});
it('4',async()=>{
    const res=await request2.post('Books')
    .send({
        "userId": userId,
        "collectionOfIsbns": [
          {
            "isbn": "122222"
          }
        ]
      }).set('Authorization',`Bearer ${token}`);
   
      expect(res.body.message).to.equal("ISBN supplied is not available in Books Collection!");
      expect(res.statusCode).to.equal(400);
});
it('5',async()=>{
   
    var res=await request2.put(`Books/${book[0].isbn}`)
    .send({
        "userId": userId,
        "isbn": book[1].isbn
      }).set('Authorization',`Bearer ${token}`);
      expect( res.body.books[0].isbn).to.equal(book[1].isbn);
      expect(res.statusCode).to.equal(200);
      
      const res2=await request.get(`/User/${userId}`)
       .set('Authorization',`Bearer ${token}`);
       expect(res2.body.books[0].isbn).to.equal(book[1].isbn);
       expect(res2.statusCode).to.equal(200);
});
it('7',async()=>{
   let res=await request2.delete('Book')
    .send(
      {
          "isbn": book[1].isbn,
          "userId": userId
      }
    ).set('Authorization',`Bearer ${token}`);
   expect(res.statusCode).to.equal(204);

   let res2= await request.get(`/User/${userId}`)
   .set('Authorization',`Bearer ${token}`);
   expect(res2.body.books.length).to.equal(0);
   expect(res.statusCode).to.equal(204);

});
it('8',async()=>{
    
    
  let res=await request2.delete('Book')
  .send(
    {
        "isbn": "9781449325862222",
        "userId": userId
    }
  ).set('Authorization',`Bearer ${token}`);
  expect(res.body.message).to.equal("ISBN supplied is not available in User's Collection!");
  expect(res.statusCode).to.equal(400);
});
});
