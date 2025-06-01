describe('submit tests', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000/neworder')
	})

	it('should show error message, if required fields are not filled', () => {
		cy.getByDataCy('submit').click()

		cy.getByDataCy('error-toast').should('be.visible')
	})

	it('should show success message, after order submit', () => {
		cy.getByDataCy('first-name').type('Name')
		cy.getByDataCy('last-name').type('Surname')
		cy.getByDataCy('phone-nr').type('066666666')
		cy.getByDataCy('telegram').type('polad_10')
		cy.getByDataCy('ozon').check()
		cy.getByDataCy('description').type('Description...')
		cy.getByDataCy('terms').check()

		cy.getByDataCy('submit').click()

		cy.getByDataCy('success').should('be.visible')
	})
})
