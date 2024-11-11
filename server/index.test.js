import { initializetestDb, insertTestUser, getToken } from './helpers/test.js'
import { expect } from 'chai'

const base_url = 'http://localhost:3001'


describe('GET Tasks', () => {
    before(() => {
        initializetestDb()
    })

    it('should return all tasks', async () => {
        console.log('Starting GET Tasks test')
        const response = await fetch(base_url)
        console.log('Response received:', response)
        const data = await response.json()
        console.log('Data received:', data);
        expect(response.status).to.equal(200)
        expect(data).to.be.an('array').that.is.not.empty
        expect(data[0]).to.include.all.keys('id','description')
    })
})

describe('POST task', () => {
    const email = 'post@foo.com'
    const password = 'post123'
    insertTestUser(email,password)
    const token = getToken(email)
    it ('should post a task', async () => {
        console.log('Starting POST task test')
        const response = await fetch(base_url + '/create',{
            method: 'post',
            headers: {
                'Content-Type':'application/json',
                Authorization: token
            },
            body: JSON.stringify({'description':'Task from unit test'})
        })
        console.log('Response received:', response)
        const data = await response.json()
        console.log('Data received:', data)
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    it ('should not post a task without description', async () => {
        console.log('Starting POST task without description test')
        const response = await fetch(base_url + '/create',{
            method: 'post',
            headers: {
                'Content-Type':'application/json',
                Authorization: token
            },
            body: JSON.stringify({'description':null})
        })
        console.log('Response received:', response)
        const data = await response.json()
        console.log('Data received:', data)
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

describe('DELETE task', () => {
    it ('should delete a task', async() => {
        console.log('Starting DELETE task test')
        const token = getToken('email')
        const response = await fetch(base_url + '/delete/1',{
            method: 'delete',
            headers: {
                Authorization: token
            }
        })
        console.log('Response received:', response)
        const data = await response.json()
        console.log('Data received:', data)
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    it ('should not delete a task with SQL injection', async () => {
        console.log('Starting DELETE task with SQL injection test')
        const token = getToken('email')
        const response = await fetch(base_url + '/delete/id=0 or id > 0',{
            method: 'delete',
            headers: {
                Authorization: token
            }
        })
        console.log('Response received:', response)
        const data = await response.json()
        console.log('Data received:', data)
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})
    
describe('POST register',() => {
    const email = 'register@foo.com'
    const password = 'register123'
    it ('should register with valid email and password', async () => {
        console.log('Starting POST register test')
        const response = await fetch(base_url + '/user/register',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        })
        console.log('Response received:', response)
        const data = await response.json()
        console.log('Data received:', data)
        expect(response.status).to.equal(201,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id','email')
    })
})

describe('POST login',() => {
    const email = 'login@foo.com'
    const password = 'login123'
    insertTestUser(email,password)
    it ('should login with valid credentials', async () => {
        console.log('Starting POST login test')
        const response = await fetch(base_url + '/user/login',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        })
        console.log('Response received:', response)
        const data = await response.json()
        console.log('Data received:', data)
        expect(response.status).to.equal(200,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id','email','token')
    })
})