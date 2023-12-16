const { spec } = require('pactum');

describe('Retrieving data', () => {

    test('should yield HTTP status code 200', async () => {

        await spec()
            .get('http://localhost:8082/items/')
            .expectStatus(200)
    });

    test('should return all items', async () => {

        await spec()
            .get('http://localhost:8082/items')
            .expectStatus(200)
            .expectJson([{
                "_id": "657d615f981de6304e97ff87",
                "id": 3,
                "displayName": "Microwave",
                "cartId": 1,
                "__v": 0,
                "assignedUser": 7
              },
              {
                "_id": "657d6177981de6304e97ff89",
                "id": 6,
                "displayName": "Microwave 2",
                "cartId": 2,
                "__v": 0
              }])
    });

    test('should item with id 3', async () => {

        await spec()
            .get("http://localhost:8082/item")
            .withHeaders('Content-Type', 'application/json')
            .withBody(`
            {
              "itemId": 3
            }
          `)
            .expectStatus(200)
            .expectJson(
            {  
                "_id": "657d615f981de6304e97ff87",
                "id": 3,
                "displayName": "Microwave",
                "cartId": 1,
                "__v": 0,
                "assignedUser": 7
              }
            )
    });
    // test('should add item with id 666 and check it', async () => {

    //     await spec()
    //         .post("http://localhost:8082/add_item")
    //         .withHeaders('Content-Type', 'application/json')
    //         .withBody(`
    //         {
    //             "id": 666,
    //             "displayName": "AAAAAAA",
    //             "assignedUser": 1,
    //             "cartId": 0
    //         }
    //       `)
    //         .expectStatus(200)

    //     await spec() 
    //         .get("http://localhost:8082/item")
    //         .withHeaders('Content-Type', 'application/json')
    //         .withBody(`
    //             {
    //             "itemId": 666
    //             }
    //         `)  
    //         .expectJsonMatch(
    //                 "displayName", "AAAAAAA"
    //         )
    // });

    test('check assignment', async () => {

        await spec()
            .post("http://localhost:8082/assignment")
            .withHeaders('Content-Type', 'application/json')
            .withBody(`
            {
                "userId": 7,
                "cartId": 5,
                "itemId": 3
            }
          `)
            .expectStatus(202)
        
        await spec()
            .get("http://localhost:8081/user")
            .withHeaders('Content-Type', 'application/json')
            .withBody(`
            {
              "userId": 7
            }
          `)
          .expectJson(
                {
                "_id": "657d66e4e71b406577a8ea18",
                "id": 7,
                "type": "user",
                "displayName": "hor",
                "cart": 5,
                "img": "df",
                "__v": 0
                }
        )
            .expectStatus(200)    
    });
});

