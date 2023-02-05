import mjml from 'mjml'
import View from '@ioc:Adonis/Core/View'
import User from 'App/Models/User'
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Application from '@ioc:Adonis/Core/Application'

export default class BindBoostyEmail extends BaseMailer {
  constructor (private user: User) {
    super()
  }
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  public html = mjml(View.renderSync('emails/bind-boosty', {
    requiredEmail: true,
  })).html

  /**
   * The prepare method is invoked automatically when you run
   * "VerifyEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare (message: MessageContract) {
    message
      .subject('MeshHouse - Boosty successful binded')
      .from('no-reply@meshhouse.art')
      .to(this.user.email)
      .html(this.html)
      .text('MeshHouse - Boosty successfully binded')
      .embed(Application.tmpPath('views/emails/logo_header.png'), 'logo-header')
      .embed(Application.tmpPath('views/emails/email_hero.jpg'), 'hero')
  }
}
