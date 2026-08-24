using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Core.Domain.Helpers
{
    public static class EncryptionHelper
    {
        private static byte[] _key = Encoding.UTF8.GetBytes("AlMulhimTravelSecureKey2026!Pass"); // 32 bytes fallback key

        public static void Initialize(string keyString)
        {
            if (string.IsNullOrEmpty(keyString)) return;

            // Make sure key is exactly 32 bytes for AES-256
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(keyString);
            var hashedKey = sha256.ComputeHash(bytes); // Guaranteed 32 bytes
            _key = hashedKey;
        }

        public static string Encrypt(string plainText)
        {
            if (string.IsNullOrEmpty(plainText)) return plainText;

            using var aes = Aes.Create();
            aes.Key = _key;
            aes.GenerateIV();
            var iv = aes.IV;

            using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
            using var ms = new MemoryStream();
            
            // Write IV first
            ms.Write(iv, 0, iv.Length);

            using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
            using (var sw = new StreamWriter(cs))
            {
                sw.Write(plainText);
            }

            return Convert.ToBase64String(ms.ToArray());
        }

        public static string Decrypt(string cipherText)
        {
            if (string.IsNullOrEmpty(cipherText)) return cipherText;

            try
            {
                var fullCipher = Convert.FromBase64String(cipherText);
                if (fullCipher.Length < 16) return cipherText; // Invalid encrypted data, return as-is (legacy)

                using var aes = Aes.Create();
                aes.Key = _key;

                var iv = new byte[16];
                var cipher = new byte[fullCipher.Length - 16];

                Buffer.BlockCopy(fullCipher, 0, iv, 0, iv.Length);
                Buffer.BlockCopy(fullCipher, iv.Length, cipher, 0, cipher.Length);

                aes.IV = iv;

                using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
                using var ms = new MemoryStream(cipher);
                using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
                using var sr = new StreamReader(cs);

                return sr.ReadToEnd();
            }
            catch
            {
                // If decryption fails, it might be unencrypted legacy data. Return as-is.
                return cipherText;
            }
        }
    }
}
