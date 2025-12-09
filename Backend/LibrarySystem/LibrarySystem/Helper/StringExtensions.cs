using System;
using System.Globalization;

public static class StringExtensions
{
    public static string ToLowerTr(this string text)
    {
        if (text == null)
            return null;

        return text.ToLower(new CultureInfo("tr-TR"));
    }
}
