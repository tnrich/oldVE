/*
 * Cr�� le 7 mars 2006
 *
 * Pour changer le mod�le de ce fichier g�n�r�, allez � :
 * Fen�tre&gt;Pr�f�rences&gt;Java&gt;G�n�ration de code&gt;Code et commentaires
 */
package org.jsdoctoolkit.model;

import java.io.IOException;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

public class MyLogger {

    private static Logger log = null;

    public MyLogger() {
        super();
    }

    public static Logger getLogger() {
        if (log == null) {
            log = Logger.getLogger("main");
            FileHandler fh;
            // ConsoleHandler ch;
            try {
                fh = new FileHandler("log/log.txt");
                fh.setFormatter(new SimpleFormatter());
                log.addHandler(fh);
                /*
                 * ch = new ConsoleHandler(); ch.setFormatter(new SimpleFormatter());
                 * log.addHandler(ch);
                 */

                log.setLevel(Level.INFO);
            } catch (SecurityException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return log;
    }

}
