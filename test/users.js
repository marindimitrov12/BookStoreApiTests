
import {expect} from 'chai';
import request from '../config/common'

describe('UsersValidation',()=>{
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
             
    it('UserName or Password not empty',(done)=>{
       request.post('/User')
       .send({
        "userName": "",
        "password": ""
      }).end((err,res)=>{
       expect(res.body.message).to.equal("UserName and Password required.");
       expect(res.status).to.equal(400);
        
        done();
       });
    });
    it('Password_validation',(done)=>{
        request.post('/User')
        .send({
            "userName": "Marin",
            "password": "Pkml12g5"
          }).end((err,res)=>{
             expect(res.body.message).to.equal("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.");
             expect(res.status).to.equal(400);
             done();
          });
    });
    it('Password_Empty',(done)=>{
        request.post('/User')
       .send({
        "userName": "Marin Dimitrov",
        "password": ""
      }).end((err,res)=>{
       expect(res.body.message).to.equal("UserName and Password required.");
       expect(res.status).to.equal(400);
       
        done();
       });
    });
    it('UserName_Empty',(done)=>{
        request.post('/User')
       .send({
        "userName": "Marin Dimitrov",
        "password": ""
      }).end((err,res)=>{
       expect(res.body.message).to.equal("UserName and Password required.");
       expect(res.status).to.equal(400);
        
        done();
       });
    });
    it('User Already exists',(done)=>{
        request.post('/User')
        .send({
            "userName": "Marin",
            "password": "Pkml12g5!"
          }).end(()=>{
            request.post('/User')
            .send({
                "userName": "Marin",
                "password": "Pkml12g5!"
              }).end((err,res)=>{
                expect(res.body.message).to.equal("User exists!");
               
                done();
              });
          });
    });
    it('2.User_CreatedSuccessfully',(done)=>{
         request.get(`/User/${userId}`)
         .set('Authorization',`Bearer ${token}`)
         .end((err,res)=>{
           expect(res.body.userId).to.equal(userId);
           expect(res.statusCode).to.equal(200);
           done();
         });
    });
});