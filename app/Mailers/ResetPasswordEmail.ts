import mjml from 'mjml'
import View from '@ioc:Adonis/Core/View'
import User from 'App/Models/User'
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Application from '@ioc:Adonis/Core/Application'

export default class ResetPasswordEmail extends BaseMailer {
  constructor (private user: User, private code: string) {
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

  public html = mjml(View.renderSync('emails/reset-password', {
    requiredEmail: true,
    code: this.code.split('').join(' '),
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
      .subject('MeshHouse - Reset password for account')
      .from('no-reply@meshhouse.art')
      .to(this.user.email)
      .html(this.html)
      .text('MeshHouse - Reset password for account')
      .embed(Application.tmpPath('views/emails/logo_header.png'), 'logo-header')
      .embed(Application.tmpPath('views/emails/email_hero.jpg'), 'hero')
  }
}
