<h2>
    Verify your email address
</h2>

<p>
    <strong>Username: </strong><?= $user->username ?>
</p>

<p>
    You can access the fund management software, while connected to the domain, by visiting <a href="http://funds.pprdomain.local/">http://funds.pprdomain.local/</a>
</p>

<p>
    <strong>You're almost done!</strong>
    Simply click the activation link below to verify your email address and activate your account.
</p>

<table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
    <tbody>
        <tr>
            <td align="left">
                <table border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <td>
                                <a href="http://funds.pprdomain.local/verify-email/<?= $user->token ?>" 
                                   target="_blank">
                                    Activate your account
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>

<p>If you encounter any issues, please contact <a href="mailto:jtrumbull@pprnoteco.com">jtrumbull@pprnoteco.com</a></p>
